

import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

const accessTokenSecret = 'asd123!@#';

export const authenticate = ( req: any, res: Response, next: NextFunction ) => {
    const authHeader = req.headers.authorization;

    if ( authHeader ) {
        const token = authHeader.split( ' ' )[ 1 ];
        jwt.verify( token, accessTokenSecret, ( err: any, user: any ) => {
            if ( err ) {
                return res.sendStatus( 403 );
            }

            req.Player = user;
            next();
        } );
    } else {
        res.sendStatus( 401 );
    }
};

