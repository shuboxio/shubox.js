/// <reference types="dropzone" />
import { ShuboxCallbacks } from './src/shubox_callbacks';
import * as Dropzone from 'dropzone';
export declare class Shubox {
    static instances: Array<Dropzone>;
    signatureUrl: string;
    uploadUrl: string;
    selector: string;
    options: any;
    formOptions: object;
    callbacks: ShuboxCallbacks;
    init(selector: string): void;
    constructor(selector?: string);
}
