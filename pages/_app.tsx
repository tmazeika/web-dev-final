import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { initializeApp } from 'firebase/app';
import type { AppProps } from 'next/app';

const firebaseConfig = {
  apiKey: 'AIzaSyD4TzVjpygA4DzXElYnKQiz5zZ0l-j16Ws',
  authDomain: 'web-dev-final-6c700.firebaseapp.com',
  projectId: 'web-dev-final-6c700',
  storageBucket: 'web-dev-final-6c700.appspot.com',
  messagingSenderId: '1076338547172',
  appId: '1:1076338547172:web:96a2b471d87893d7300ff1',
};

initializeApp(firebaseConfig);

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;
