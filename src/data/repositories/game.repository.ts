
import { GenricRepository } from './generic.repository';
import { DB } from '../../core/db/db-connection';
import { Game } from '../models/game.model';
import { ResultSetHeader } from 'mysql2';
import { DBCommand } from '../../core/db/db-command';
export class GameRepository extends GenricRepository<Game>{
    constructor ( db: DB ) {
        super( db );
    }
    async listSimple (): Promise<Game[]> {
        const queryText: string = 'SELECT GameId, NoOfQuestions, Status, WinerId FROM Game';
        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;
        const result = await this.db.execute( dbCommand );
        return this.map( result );
    }

    async findById ( id: number ): Promise<Game[]> {
        const queryText: string = 'SELECT GameId, NoOfQuestions, Status, WinerId FROM Game WHERE GameId = @GameId';
        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;
        dbCommand.addDbParameter( '@GameId', id );
        const result = await this.db.execute( dbCommand );
        return this.map( result );
    }

    async add ( game: Game ): Promise<number> {
        const queryText: string = `
            INSERT INTO Game
            (             
                NoOfQuestions, Status 
            ) 
            VALUES(
                @NoOfQuestions, @Status 
            )
        `;
        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;

        dbCommand.addDbParameter( '@NoOfQuestions', game.NoOfQuestions );
        dbCommand.addDbParameter( '@Status', game.Status );

        let result: ResultSetHeader = await this.db.execute( dbCommand );
        return result.insertId;
    }

    async update ( game: Game ): Promise<number> {
        const queryText: string = `
            UPDATE Game SET            
                  Status = @Status, WinerId = @WinerId
            WHERE GameId = @GameId
        `;
        const dbCommand: DBCommand = new DBCommand();
        dbCommand.query = queryText;

        dbCommand.addDbParameter( '@WinerId', game.WinerId );
        dbCommand.addDbParameter( '@Status', game.Status );
        dbCommand.addDbParameter( '@GameId', game.GameId );

        let result: ResultSetHeader = await this.db.execute( dbCommand );
        return result.insertId;
    }

}
