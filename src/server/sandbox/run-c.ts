import { Command, CommandFinished, Sandbox } from '@vercel/sandbox';
import { RunCResponse } from '../../models/run-c';

const SANDBOX_DIR = '/vercel/sandbox';
const COMPILE_TIMEOUT_MS = 15_000;
const RUN_TIMEOUT_MS = 10_000;

type CommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
};

async function runWithTimeout(
  sandbox: Sandbox,
  params: { cmd: string; args?: string[] },
  timeoutMs: number
): Promise<CommandResult> {
  const command: Command = await sandbox.runCommand({
    ...params,
    cwd: SANDBOX_DIR,
    detached: true
  });

  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    void command.kill('SIGKILL');
  }, timeoutMs);

  let finished: CommandFinished;
  try {
    finished = await command.wait();
  } finally {
    clearTimeout(timer);
  }

  const [stdout, stderr] = await Promise.all([finished.stdout(), finished.stderr()]);
  return { stdout, stderr, exitCode: finished.exitCode, timedOut };
}

/**
 * Credentials for the Vercel API. When unset, the SDK falls back to the
 * `VERCEL_OIDC_TOKEN` it finds in the environment (only available when this
 * server itself runs on Vercel), so this stays empty outside that case.
 */
function getCredentials(): { teamId: string; projectId: string; token: string } | object {
  const teamId = process.env['VERCEL_TEAM_ID'];
  const projectId = process.env['VERCEL_PROJECT_ID'];
  const token = process.env['VERCEL_TOKEN'];

  return teamId && projectId && token ? { teamId, projectId, token } : {};
}

/**
 * Compiles and runs untrusted C source inside an isolated, network-less
 * Vercel Sandbox microVM, then tears the sandbox down.
 */
export async function runCInSandbox(code: string): Promise<RunCResponse> {
  const sandbox = await Sandbox.create({
    ...getCredentials(),
    image: 'vercel/sandbox/arch', // ships gcc preinstalled (base-devel), no apt/install step needed
    resources: { vcpus: 1 },
    timeout: 60_000,
    networkPolicy: 'deny-all',
    persistent: false
  });

  try {
    await sandbox.writeFiles([{ path: `${SANDBOX_DIR}/main.c`, content: code }]);

    const compile = await runWithTimeout(
      sandbox,
      { cmd: 'gcc', args: ['-Wall', '-o', 'main', 'main.c'] },
      COMPILE_TIMEOUT_MS
    );
    if (compile.timedOut || compile.exitCode !== 0) {
      return { stage: 'compile', ...compile };
    }

    const run = await runWithTimeout(sandbox, { cmd: './main' }, RUN_TIMEOUT_MS);
    return { stage: 'run', ...run };
  } finally {
    await sandbox.stop();
  }
}
