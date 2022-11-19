
import { GenricRepository } from './generic.repository';
import { DB } from '../../core/db/db-connection';
import { ResultSetHeader } from 'mysql2';
import { DBCommand } from '../../core/db/db-command';
import { GamePlayerMap } from '../models/game.-player-map.model';
export class GamePlayerMapRepository extends GenricRepository<GamePlayerMap>{
    constructor ( db: DB ) {
        super( db );
    }

    async findByGameId ( id: number ): Promise<GamePlayerMap[]> {
        const queryText: string = 'SELECT GP.GameId, GP.PlayerId, P.PlayerName FROM GamePlayerMap GP INNER JOIN Players P ON P.PlayerId = GP.PlayerId WHERE GameId = @GameId';
        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;
        dbCommand.addDbParameter( '@GameId', id );
        const result = await this.db.execute( dbCommand );
        return this.map( result );
    }

    async add ( gamePlayerMap: GamePlayerMap ): Promise<void> {
        const queryText: string = `
            INSERT INTO GamePlayerMap
            (             
                GameId, PlayerId 
            ) 
            VALUES(
                @GameId, @PlayerId 
            )
        `;
        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;

        dbCommand.addDbParameter( '@GameId', gamePlayerMap.GameId );
        dbCommand.addDbParameter( '@PlayerId', gamePlayerMap.PlayerId );

        await this.db.execute( dbCommand );
    }

    async deleteByGameAndPlayer ( gamePlayerMap: GamePlayerMap ): Promise<void> {
        const queryText: string = `DELETE FROM GamePlayerMap WHERE GameId = @GameId AND PlayerId = @PlayerId `;
        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;

        dbCommand.addDbParameter( '@GameId', gamePlayerMap.GameId );
        dbCommand.addDbParameter( '@PlayerId', gamePlayerMap.PlayerId );

        await this.db.execute( dbCommand );
    }


}
