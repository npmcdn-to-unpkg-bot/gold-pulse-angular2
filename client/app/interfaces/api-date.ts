/* An interface for the dates array returned by the goldminerpulse api */
export interface ApiDate {
    ymd: string;
    oids: Array<any>; // The oids array varies depending on how the api is set
    cp: any; // Also varies
}