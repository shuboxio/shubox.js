import { ShuboxCallbacks } from './src/shubox_callbacks';
export declare class Shubox {
    static instances: Array<Shubox>;
    signatureUrl: string;
    uploadUrl: string;
    selector: string;
    options: any;
    formOptions: object;
    callbacks: ShuboxCallbacks;
    constructor();
}
