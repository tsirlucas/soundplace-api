import {User} from 'models';

import {DBConnection} from './DBConnection';

export class YoutubeUserUpdater {
  private static instance: YoutubeUserUpdater;

  static getInstance() {
    if (!this.instance) {
      this.instance = new YoutubeUserUpdater();
    }

    return this.instance;
  }

  public async setUser(user: User) {
    return new Promise((res, reject) => {
      DBConnection.getInstance().getClient(async (client) => {
        try {
          await client.query(
            'INSERT INTO user_data (id, name, image)\
              VALUES ($1, $2, $3)\
              ON CONFLICT (id) DO NOTHING;',
            [user.id, user.name, user.image],
          );
          res();
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
