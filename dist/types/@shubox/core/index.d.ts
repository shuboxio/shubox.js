/// <reference types="dropzone" />
import * as Dropzone from 'dropzone';
export default class Shubox {
    static instances: Array<Dropzone>;
    signatureUrl: string;
    uploadUrl: string;
    selector: string;
    element: HTMLElement | HTMLInputElement;
    options: any;
    constructor(selector?: string, options?: object);
    init(options: object): void;
}
