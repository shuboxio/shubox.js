import {insertAtCursor} from './src/insert_at_cursor';
import {ShuboxCallbacks} from './src/shubox_callbacks';
import {mergeObject} from './src/merge_object';

export class Shubox {
  static instances: Array<Shubox> = [];

  selector: string;
  options: any = {};
  formOptions: object = {previewsContainer: false};
  callbacks: ShuboxCallbacks = new ShuboxCallbacks();
}
