import {DBConnection} from './DBConnection';

export class SpotifyAuth {
  private static instance: SpotifyAuth;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyAuth();
    }

    return this.instance;
  }

  public async getToken(userId: string) {
    const {rows} = await DBConnection.getInstance().query(
      'SELECT access_token FROM spotify_auth WHERE user_id=$1',
      [userId],
    );
    return rows[0].access_token;
  }
}
