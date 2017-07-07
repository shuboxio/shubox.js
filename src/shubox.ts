/// <reference types="dropzone"/>

import { fetchSetup } from '../src/lib/fetch_setup';
import { DefaultOptionsHash } from '../src/lib/types/default_options_hash';
import { mergeObject } from '../src/lib/merge_object';
import { objectToFormData } from '../src/lib/object_to_form_data';

declare var window: any;

export class Shubox {
  selector: string;
  instances: Array<Shubox>;

  options: object = {};
  formOptions: object = { previewsContainer: false };
  defaultOptions: DefaultOptionsHash = {
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
