import { DBparameter } from "./interfaces/db-parameter.interface";

export class DBCommand {
    dbParameters: DBparameter[] = [];
    query: string;
    addDbParameter ( parameter: string, value: any ) {
        const param: DBparameter = { parameter, value, position: 0 };
        this.dbParameters.push( param );
    }

    formatQuery (): void {
        this.query.replace( /\n/g, '' ).replace( /\s+/g, ' ' ).trim();
    }
}