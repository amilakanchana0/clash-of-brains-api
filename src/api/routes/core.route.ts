import { Request, Response } from 'express';
import * as socket from 'socket.io';
import { DB } from '../../core/db/db-connection';
import { ResponseMessage } from '../response/response-message';
import Websocket from '../socket/web-socket';
export class CoreRoute {
    db: DB;
    req: Request;
    res: Response;
    socket: socket.Server;
    constructor ( req: Request, res: Response ) {
        this.db = new DB();
        this.req = req;
        this.res = res;
        this.socket = Websocket.getInstance();
    }

    mapRequest<T> (): T {
        let keys: string[] = Object.keys( this.req.body );
        let entity: any = {};
        keys.forEach( ( key: string ) => {
            entity[ key ] = this.req.body[ key ];
        } );
        return entity as T;
    }

    getParameter ( key: string ): any {

        return this.req.query[ key ];
    }

    get playerId (): any {
        return ( this.req as any ).PlayerId;
    }

    handleError ( returnValue: ResponseMessage, err: unknown ): void {
        returnValue.Message = err as any;
        returnValue.IsSuccessfull = false;
        this.res.status( 500 );
    }

}