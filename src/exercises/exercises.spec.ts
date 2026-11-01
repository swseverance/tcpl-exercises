import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { EXERCISES } from './index';

describe('exercise solutions', () => {
  for (const exercise of EXERCISES) {
    describe(`Exercise ${exercise.id}`, () => {
      let binPath: string;
      let dir: string;

      beforeAll(() => {
        dir = mkdtempSync(join(tmpdir(), 'tcpl-exercise-'));
        writeFileSync(join(dir, 'main.c'), exercise.solution);
        binPath = join(dir, 'main');

        execFileSync('gcc', ['-Wall', '-o', binPath, join(dir, 'main.c')]);
      });

      afterAll(() => {
        rmSync(dir, { recursive: true, force: true });
      });

      exercise.tests.forEach((test, index) => {
        it(`passes test case ${index + 1}`, () => {
          const result = spawnSync(binPath, [], {
            input: test.stdin ?? '',
            encoding: 'utf8',
            timeout: 5000
          });

          expect(result.stdout).toBe(test.expectedStdout);
        });
      });
    });
  }
});
