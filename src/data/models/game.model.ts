import { GameStatus } from "../constants/game-status.type";

export class Game {
    GameId: number;
    NoOfQuestions: number;
    Status: GameStatus;
    WinerId?: number;
    IsBothPlayersJoined: boolean;

    constructor ( noOfQuestions: number, status: number ) {
        this.NoOfQuestions = noOfQuestions;
        this.Status = status;
    }
}