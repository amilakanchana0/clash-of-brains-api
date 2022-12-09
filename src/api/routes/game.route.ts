import { GamePlayerMap } from './../../data/models/game.-player-map.model';
import { GamePlayerMapRepository } from './../../data/repositories/game-player-map.repository';
import { GameStatus } from './../../data/constants/game-status.type';

import { Game } from '../../data/models/game.model';
import { GameRepository } from '../../data/repositories/game.repository';
import { CoreRoute } from './core.route';
import { Request, Response } from 'express';
import { ResponseMessage } from '../response/response-message';
import { GamePlayerQuestionMap } from '../../data/models/game-player-question-map.model';
import { PlayerRepository } from '../../data/repositories/player.repository';
import { Player } from '../../data/models/player.model';
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

    async joinGame (): Promise<void> {
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();
            await this.db.beginTransaction();

            const gameId: number = this.getParameter( 'gameId' );

            let gamePlayerMapRepository: GamePlayerMapRepository = this.db.getRepository( GamePlayerMapRepository );
            let gameRepository: GameRepository = this.db.getRepository( GameRepository );

            const gamePlayerMap: GamePlayerMap = new GamePlayerMap( gameId, this.playerId );

            await gamePlayerMapRepository.deleteByGameAndPlayer( gamePlayerMap );
            await gamePlayerMapRepository.add( gamePlayerMap );

            const gamePlayers: GamePlayerMap[] = await gamePlayerMapRepository.findByGameId( gameId );

            const game: Game = ( await gameRepository.findById( this.getParameter( 'gameId' ) ) )[ 0 ];
            console.log( 'ddsdsd', game );
            if ( gamePlayers.length > 1 ) {
                game.Status = GameStatus.Started;
                await gameRepository.update( game );
            }
            await this.db.commit();
            gamePlayers.forEach( ( i: GamePlayerMap ) => { i.Questions = this.setQuestions( game.NoOfQuestions ) } );

            returnValue.Content = gamePlayers;

            this.socket.emit( 'playerJoined', gamePlayers );


        } catch ( err ) {
            if ( this.db ) {
                this.db.rollback();
            }
            console.log( err );
            this.handleError( returnValue, err );
        }
        finally {
            if ( this.db ) {
                console.log( 'joinGame - released' );
                this.db.release();
            }
        }
        this.res.send( returnValue );
    }

    async onAnswerSubmit (): Promise<void> {
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();
            await this.db.beginTransaction();

            const gamePlayerMap: GamePlayerMap = this.mapRequest<GamePlayerMap>()

            let gameRepository: GameRepository = this.db.getRepository( GameRepository );

            const game: Game = ( await gameRepository.findById( gamePlayerMap.GameId ) )[ 0 ];

            game.Status = GameStatus.InProgress;
            await gameRepository.update( game );

            this.db.commit();

            this.socket.emit( 'onAnswerSubmit', gamePlayerMap );
            returnValue.Content = gamePlayerMap;


        } catch ( err ) {
            if ( this.db ) {
                this.db.rollback();
            }
            console.log( err );
            this.handleError( returnValue, err );
        }
        finally {
            if ( this.db ) {
                console.log( 'onAnswerSubmit - released' );
                this.db.release();
            }
        }
        this.res.send( returnValue );
    }

    async updateWinner (): Promise<void> {
        let returnValue: ResponseMessage = new ResponseMessage();
        try {

            await this.db.connect();
            await this.db.beginTransaction();

            let gameRepository: GameRepository = this.db.getRepository( GameRepository );
            let playerRepository: PlayerRepository = this.db.getRepository( PlayerRepository );

            const game: Game = ( await gameRepository.findById( this.getParameter( 'gameId' ) ) )[ 0 ];
            const player: Player = ( await playerRepository.findById( this.playerId ) )[ 0 ];

            if ( game.Status != GameStatus.Completed ) {
                game.Status = GameStatus.Completed;
                game.WinerId = this.playerId;
                await gameRepository.update( game );

                player.GamesWon += 1;

                await playerRepository.updateGamesWon( player );
            }


            this.db.commit();

        } catch ( err ) {
            if ( this.db ) {
                this.db.rollback();
            }
            console.log( err );
            this.handleError( returnValue, err );
        }
        finally {
            if ( this.db ) {
                console.log( 'updateWinner - released' );
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
        let returnValue: ResponseMessage = new ResponseMessage();
        try {
            await this.db.connect();

            let gameRepository: GameRepository = this.db.getRepository( GameRepository );
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