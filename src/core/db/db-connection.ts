import * as mysql from 'mysql2/promise';
import { PoolConnection } from 'mysql2/promise';
import { QuaryBuilder } from './helpers/quary-builder.helper';
import { Quary } from './interfaces/quary.interface';
import { DBCommand } from './db-command';


const pool = mysql.createPool( {
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12561279',
    password: 'nxykHX6BCN',
    database: 'sql12561279',
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 0,
    port: 3306,
    connectTimeout: 20000
} );



let connection: PoolConnection;
export class DB {
    async connect (): Promise<void> {
        try {
            connection = await pool.getConnection();
        }
        catch ( err ) {
            console.log( err )
            throw new Error();
        }
    }

    async beginTransaction (): Promise<void> {
        await connection.beginTransaction();
    }

    private async query ( quaryText: string, values?: any[] ): Promise<any> {
        const result: any[] = await connection.query( quaryText, values );
        return result[ 0 ];
    }

    async execute ( dbCommad: DBCommand ): Promise<any> {
        dbCommad.formatQuery();
        const quaryObj: Quary = QuaryBuilder.buildQuary( dbCommad )
        return await this.query( quaryObj.quaryString, quaryObj.values );
    }

    async rollback (): Promise<void> {
        await connection?.rollback();
    }

    async commit (): Promise<void> {
        await connection.commit();
    }

    release (): void {
        connection?.release();
    }

    getRepository<T> ( type: ( new ( connection: DB ) => T ) ): T {
        return new type( this );
    }


}