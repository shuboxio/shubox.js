export interface IFile {
    name: string | null | undefined;
}
export interface IPastedFile {
    name: string | null | undefined;
}
export declare function filenameFromFile(file: IFile | IPastedFile, date?: Date): string;
