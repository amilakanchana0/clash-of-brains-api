
import { Player } from '../../data/models/player.model';
import { PlayerRepository } from '../../data/repositories/player.repository';
import { CoreRoute } from './core.route';
import { Request, Response } from 'express';
import { createToken } from '../../core/auth/authenticator';
import { ResponseMessage } from '../response/response-message';
export class PlayerRouter extends CoreRoute {
    constructor ( req: Request, res: Response ) {
        super( req, res );
    }
    async add (): Promise<void> {
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();
            await this.db.beginTransaction();

            let playerRepository: PlayerRepository = this.db.getRepository( PlayerRepository );
            const player: Player = this.mapRequest<Player>();

            const newPlayer: Player = new Player( player.PlayerName, Buffer.from( player.Password, 'binary' ).toString( 'base64' ) );
            player.JoinedOn = new Date();


            const players: Player[] = await playerRepository.finByUserName( newPlayer );
            if ( players.length ) {
                returnValue.Message = 'Player already exists, Sign in instead';
                this.res.status( 400 );
            } else {
                const newId: number = await playerRepository.add( newPlayer );

                newPlayer.PlayerId = newId;
                createToken( newPlayer );
                returnValue.Content = newPlayer.safePlayer();
            }

            await this.db.commit();

        } catch ( err ) {
            if ( this.db ) {
                this.db.rollback();
            }
            console.log( err );
            this.handleError( returnValue, err );
        }

        finally {
            if ( this.db ) {
                this.db.release();
            }
        }

        this.res.send( returnValue );

    }

    async signIn (): Promise<void> {
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();
            await this.db.beginTransaction();

            let playerRepository: PlayerRepository = this.db.getRepository( PlayerRepository );
            const player: Player = this.mapRequest<Player>();

            const newPlayer: Player = new Player( player.PlayerName, Buffer.from( player.Password, 'binary' ).toString( 'base64' ) );

            const players: Player[] = await playerRepository.finByUserNameAndPassword( newPlayer );
            if ( players.length ) {
                newPlayer.PlayerId = players[ 0 ].PlayerId;
                createToken( newPlayer );
                returnValue.Content = newPlayer.safePlayer();
            } else {
                returnValue.Message = 'Invalid player name or passowrd';
                this.res.status( 400 );
            }

            await this.db.commit();

        } catch ( err ) {
            if ( this.db ) {
                this.db.rollback();
            }
            console.log( err );
            this.handleError( returnValue, err );
        }

        finally {
            if ( this.db ) {
                this.db.release();
            }
        }

        this.res.send( returnValue );

    }


    async getTop5Players (): Promise<void> {
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();

            let playerRepository: PlayerRepository = this.db.getRepository( PlayerRepository );
            const palyers: Player[] = await playerRepository.getTop5Players();

            returnValue.Content = palyers;


        } catch ( err ) {
            console.log( err );
        }

        finally {
            if ( this.db ) {
                this.db.release();
            }
        }

        this.res.send( returnValue );

    }

}