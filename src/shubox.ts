/// <reference types="../typings/shubox"/>

import { fetchSetup } from './lib/fetch_setup';
import { uploadCompleteEvent } from './lib/upload_complete_event';

declare var window: any;

export class Shubox {
  selector: string;
  instances: Array<Shubox>;

  options: object = {};
  formOptions: object = { previewsContainer: false };
  defaultOptions: Shubox.DefaultOptionsHash = {
    success: function(file){},
    error: function(file, error){},
    textBehavior: 'replace',
    s3urlTemplate: '{{s3url}}',
    acceptedFiles: 'image/*',
    clickable: true,
    previewsContainer: null,
    dictMaxFilesExceeded: "Your file limit of {{maxFiles}} file(s) has been reached.",
    maxFiles: null,
    extraParams: {}
  };

  constructor(selector: string) {
    this.selector = selector;
    fetchSetup(window);
  }
}
