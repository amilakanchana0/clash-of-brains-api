export class Player {
    PlayerId: number;
    PlayerName: string;
    Password: string;
    JoinedOn: Date;
    GamesWon: number;
    AccessToken: string;
    RefreshToken: string;

    constructor ( name: string, password: string ) {
        this.PlayerName = name;
        this.Password = password;
        this.JoinedOn = new Date();
    }

    setTokens ( accessToken: string, refreshToken: string ): void {
        this.AccessToken = accessToken;
        this.RefreshToken = refreshToken;
    }

    safePlayer (): Player {
        this.Password = undefined;
        return this;
    }

}