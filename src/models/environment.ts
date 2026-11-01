export type Environment = {
  name: 'local' | 'dev' | 'prod';
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  reCAPTCHA: string;
};
