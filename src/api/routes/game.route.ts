import { GameStatus } from './../../data/constants/game-status.type';

import { Game } from '../../data/models/game.model';
import { GameRepository } from '../../data/repositories/game.repository';
import { CoreRoute } from './core.route';
import { Request, Response } from 'express';
import { ResponseMessage } from '../response/response-message';
export class GameRouter extends CoreRoute {
    constructor ( req: Request, res: Response ) {
        super( req, res );
    }
    async createGame (): Promise<void> {

        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();
            await this.db.beginTransaction();

            let gameRepository: GameRepository = this.db.getRepository( GameRepository );
            const game: Game = this.mapRequest<Game>();

            const newGame: Game = new Game( game.NoOfQuestions, GameStatus.New );

            const newId: number = await gameRepository.add( newGame );

            newGame.GameId = newId;
            returnValue.Content = newGame;

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

    async startGame (): Promise<void> {

        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();
            await this.db.beginTransaction();

            let gameRepository: GameRepository = this.db.getRepository( GameRepository );

            const games: Game[] = await gameRepository.findById( this.mapRequest<Game>().GameId );
            const game: Game = games[ 0 ];

            game.Status = GameStatus.Started;
            returnValue.Content = game;

            gameRepository.update( game );

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



    async getList (): Promise<void> {

        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();

            let gameRepository: GameRepository = this.db.getRepository( GameRepository );
            const games: Game[] = await gameRepository.listSimple();

            returnValue.Content = games;

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