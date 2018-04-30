export interface File {
    name: string;
}
export interface PastedFile {
    name: string;
}
export declare function filenameFromFile(file: File | PastedFile, date?: Date): string;
