import Dropzone from "dropzone";
export interface IUserOptions {
    signatureUrl?: string;
    uploadUrl?: string;
    uuid?: string;
    key?: string;
}
export default class Shubox {
    static instances: Dropzone[];
    signatureUrl: string;
    uploadUrl: string;
    key: string;
    selector: string;
    element: HTMLElement | HTMLInputElement;
    options: any;
    callbacks: any;
    constructor(selector?: string, options?: IUserOptions);
    init(options: object): void;
}
