import { GamePlayerMap } from './../../data/models/game.-player-map.model';
import { GamePlayerMapRepository } from './../../data/repositories/game-player-map.repository';
import { GameStatus } from './../../data/constants/game-status.type';

import { Game } from '../../data/models/game.model';
import { GameRepository } from '../../data/repositories/game.repository';
import { CoreRoute } from './core.route';
import { Request, Response } from 'express';
import { ResponseMessage } from '../response/response-message';
import { DB } from '../../core/db/db-connection';
import { GamePlayerQuestionMap } from '../../data/models/game-player-question-map.model';
export class GameRouter extends CoreRoute {
    constructor ( req: Request, res: Response ) {
        super( req, res );
    }
    async createGame (): Promise<void> {
        this.db = new DB();
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

    async joinGame (): Promise<void> {
        this.db = new DB();
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.release();
            await this.db.connect();
            await this.db.beginTransaction();

            const gameId: number = this.getParameter( 'gameId' );

            let gamePlayerMapRepository: GamePlayerMapRepository = new GamePlayerMapRepository( this.db );
            let gameRepository: GameRepository = new GameRepository( this.db );

            const gamePlayerMap: GamePlayerMap = new GamePlayerMap( gameId, this.playerId );

            await gamePlayerMapRepository.deleteByGameAndPlayer( gamePlayerMap );
            await gamePlayerMapRepository.add( gamePlayerMap );

            const gamePlayers: GamePlayerMap[] = await gamePlayerMapRepository.findByGameId( gameId );

            const game: Game = ( await gameRepository.findById( this.getParameter( 'gameId' ) ) )[ 0 ];

            gamePlayers.forEach( ( i: GamePlayerMap ) => { i.Questions = this.setQuestions( game.NoOfQuestions ) } );

            returnValue.Content = gamePlayers;

            this.socket.emit( 'playerJoined', gamePlayers );

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
                console.log( 'rwewerwrd' );
                this.db.release();
            }
        }
        this.res.send( returnValue );
    }

    async onAnswerSubmit (): Promise<void> {
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            const gamePlayerMap: GamePlayerMap = this.mapRequest<GamePlayerMap>()

            this.socket.emit( 'onAnswerSubmit', gamePlayerMap );
            returnValue.Content = gamePlayerMap;

        } catch ( err ) {
            console.log( err );
        }

        this.res.send( returnValue );
    }

    async getList (): Promise<void> {
        this.db = new DB();
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();

            let gameRepository: GameRepository = new GameRepository( this.db );
            const games: Game[] = await gameRepository.listSimple();

            returnValue.Content = games;

        } catch ( err ) {
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

    async getGameById (): Promise<void> {
        this.db = new DB();
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();

            let gameRepository: GameRepository = new GameRepository( this.db );
            const games: Game[] = await gameRepository.findById( this.getParameter( 'gameId' ) );

            returnValue.Content = games[ 0 ];

        } catch ( err ) {
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

    setQuestions ( noOfQuestions: number ): GamePlayerQuestionMap[] {
        return Array.from( Array( noOfQuestions ).keys() ).map( ( i: number ) => {
            return {
                QuestionId: ++i,
                IsCompleted: false
            }
        } );
    }

}