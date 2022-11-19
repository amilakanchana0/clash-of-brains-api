import jwt from 'jsonwebtoken';
import { Player } from '../../data/models/player.model';

const ACCESSTOKEN: string = 'asd123!@#';
const REFRESHTOKEN: string = '#@!321dsa';

export const createToken = ( player: Player ) => {
    const accessToken: string = jwt.sign( { PlayerId: player.PlayerId, PlayerName: player.PlayerName }, ACCESSTOKEN, { expiresIn: '1h' } );
    const refreshToken: string = jwt.sign( { PlayerId: player.PlayerId, PlayerName: player.PlayerName }, REFRESHTOKEN );
    console.log( player )
    player.setTokens( accessToken, refreshToken );
}