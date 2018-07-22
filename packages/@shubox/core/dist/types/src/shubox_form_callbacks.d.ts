import Shubox from 'shubox';
export declare class ShuboxFormCallbacks {
    shubox: Shubox;
    element: HTMLInputElement;
    options: any;
    constructor(shubox: Shubox);
    toHash(): {
        success: any;
    };
}
