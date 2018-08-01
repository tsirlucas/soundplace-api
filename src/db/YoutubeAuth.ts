import {DBConnection} from './DBConnection';

export class YoutubeAuth {
  private static instance: YoutubeAuth;

  static getInstance() {
    if (!this.instance) {
      this.instance = new YoutubeAuth();
    }

    return this.instance;
  }

  public async getToken(userId: string) {
    const {rows} = await DBConnection.getInstance().query(
      'SELECT access_token FROM youtube_auth WHERE user_id=$1',
      [userId],
    );
    return rows[0].access_token;
  }
}
