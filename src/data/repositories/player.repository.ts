
import { GenricRepository } from './generic.repository';
import { DB } from '../../core/db/db-connection';
import { Player } from '../models/player.model';
import { ResultSetHeader } from 'mysql2';
import { DBCommand } from '../../core/db/db-command';
export class PlayerRepository extends GenricRepository<Player>{
    constructor ( db: DB ) {
        super( db );
    }
    async getTop5Players (): Promise<Player[]> {
        const queryText: string = 'SELECT PlayerId, PlayerName, GamesWon FROM Players  ORDER BY GamesWon DESC LIMIT 5';
        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;
        const result = await this.db.execute( dbCommand );
        return this.map( result );
    }

    async add ( player: Player ): Promise<number> {
        const queryText: string = `
            INSERT INTO Players
            (             
                PlayerName, Password,  JoinedOn
            ) 
            VALUES(
            @PlayerName, @Password,  @JoinedOn
            )
        `;
        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;

        dbCommand.addDbParameter( '@PlayerName', player.PlayerName );
        dbCommand.addDbParameter( '@Password', player.Password );
        dbCommand.addDbParameter( '@JoinedOn', player.JoinedOn );

        let result: ResultSetHeader = await this.db.execute( dbCommand );
        return result.insertId;
    }

    async finByUserNameAndPassword ( player: Player ): Promise<Player[]> {
        const queryText: string = 'SELECT PlayerId, PlayerName, GamesWon FROM Players WHERE PlayerName = @PlayerName AND Password = @Password';

        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;
        dbCommand.addDbParameter( '@PlayerName', player.PlayerName );
        dbCommand.addDbParameter( '@Password', player.Password );

        const result = await this.db.execute( dbCommand );
        return this.map( result );
    }

    async finByUserName ( player: Player ): Promise<Player[]> {
        const queryText: string = 'SELECT PlayerId, PlayerName, GamesWon FROM Players WHERE PlayerName = @PlayerName';

        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;
        dbCommand.addDbParameter( '@PlayerName', player.PlayerName );
        dbCommand.addDbParameter( '@Password', player.Password );

        const result = await this.db.execute( dbCommand );
        return this.map( result );
    }

}
