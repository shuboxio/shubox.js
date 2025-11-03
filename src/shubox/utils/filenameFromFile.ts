export interface IFile {
  name: string | null | undefined;
}

export interface IPastedFile {
  name: string | null | undefined;
}

export function filenameFromFile(file: IFile | IPastedFile, date?: Date): string {
  if (!file.name) {
    const now = date || new Date();

    // date
    const daynum = now.getDate();
    const day = daynum < 10 ? `0${daynum}` : String(daynum);
    const monthnum = now.getMonth() + 1;
    const month = monthnum < 10 ? `0${monthnum}` : String(monthnum);
    const year = now.getFullYear();

    // time
    const hour = now.getHours();
    const minutenum = now.getMinutes();
    const minute = minutenum < 10 ? `0${minutenum}` : String(minutenum);
    const secondnum = now.getSeconds();
    const second = secondnum < 10 ? `0${secondnum}` : String(secondnum);

    const datetime = `${day}.${month}.${year}-${hour}.${minute}.${second}`;

    file.name = `paste-${datetime}.jpg`;
  }

  return file.name.replace(/^.*(\\\\|\/)/g, '').replace(/[^0-9A-Za-z.\-_]/g, '_');
}
