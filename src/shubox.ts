import { fetchSetup } from '../src/lib/fetch_setup';

declare var window: any;

export class Shubox {
  selector: string;

  constructor(selector: string) {
    this.selector = selector;
    fetchSetup(window);
  }
}
