import { GamePlayerQuestionMap } from "./game-player-question-map.model";

export class GamePlayerMap {
    GameId: number;
    PlayerId: number;
    Questions: GamePlayerQuestionMap[];
    constructor ( gameId: number, playerId: number ) {
        this.GameId = gameId;
        this.PlayerId = playerId;
    }

}