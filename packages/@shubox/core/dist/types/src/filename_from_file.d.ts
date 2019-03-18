export interface IFile {
    name: string;
}
export interface IPastedFile {
    name: string;
}
export declare function filenameFromFile(file: IFile | IPastedFile, date?: Date): string;
