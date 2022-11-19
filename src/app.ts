
import express, { Application, Request, Response, NextFunction } from 'express';
import { PlayerRouter } from './api/routes/player.route';
import cors from 'cors';
import http from 'http';
import * as socket from 'socket.io';
import { authenticate } from './api/middlewares/authentirize';
import { GameRouter } from './api/routes/game.route';
import Websocket from './api/socket/web-socket';

const app: Application = express();
const httpServer: http.Server = http.createServer( app );
const io: socket.Server = Websocket.getInstance( httpServer );

app.use( cors() );
app.use( express.json() );

app.get( '/getTop5Players', authenticate, async ( req: Request, res: Response, next: NextFunction ) => {

    let playerRouter: PlayerRouter = new PlayerRouter( req, res )
    playerRouter.getTop5Players();

} );

app.post( '/signIn', async ( req: Request, res: Response, next: NextFunction ) => {
    let playerRouter: PlayerRouter = new PlayerRouter( req, res )
    playerRouter.signIn();

} );

app.post( '/signUp', async ( req: Request, res: Response, next: NextFunction ) => {
    let playerRouter: PlayerRouter = new PlayerRouter( req, res )
    playerRouter.add();

} );

app.post( '/createGame', authenticate, async ( req: Request, res: Response, next: NextFunction ) => {
    let gameRouter: GameRouter = new GameRouter( req, res )
    gameRouter.createGame();

} );

app.get( '/joinGame', authenticate, async ( req: Request, res: Response, next: NextFunction ) => {
    let gameRouter: GameRouter = new GameRouter( req, res )
    gameRouter.joinGame();

} );

app.get( '/getGameById', authenticate, async ( req: Request, res: Response, next: NextFunction ) => {
    let gameRouter: GameRouter = new GameRouter( req, res )
    gameRouter.getGameById();

} );

app.post( '/onAnswerSubmit', authenticate, async ( req: Request, res: Response, next: NextFunction ) => {
    let gameRouter: GameRouter = new GameRouter( req, res )
    gameRouter.onAnswerSubmit();

} );

httpServer.listen( 5000, () => console.log( `listening on port ${ 5000 }` ) );

