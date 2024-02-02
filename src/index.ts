import Shubox from './shubox/index';

declare global {
  interface Window {
    Shubox: any;
  }
}

window.Shubox = Shubox;
