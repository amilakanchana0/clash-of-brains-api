import { DBCommand } from "../db-command";
import { DBparameter } from "../interfaces/db-parameter.interface";
import { Quary } from "../interfaces/quary.interface";

export class QuaryBuilder {
    static buildQuary ( dbCommand: DBCommand ): Quary {
        let quaryString: string = dbCommand.query;
        let values: any[] = new Array();
        do {
            dbCommand.dbParameters.forEach( ( param: DBparameter ) => {
                if ( param.position != -1 ) {
                    if ( quaryString.includes( param.parameter, param.position ) ) {
                        values.push( param.value );
                        quaryString = quaryString.replace( param.parameter, '?' )
                        param.position += 1;
                    } else {
                        param.position = -1;
                    }
                }
            } );
        }
        while ( !dbCommand.dbParameters.every( x => x.position === -1 ) );

        return { quaryString, values } as Quary;
    }

}