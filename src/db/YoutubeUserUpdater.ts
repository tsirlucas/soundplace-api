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
            'INSERT INTO user_data (id, name, image, importing)\
              VALUES ($1, $2, $3, $4)\
              ON CONFLICT (id) DO UPDATE\
              SET name = excluded.name,\
              image = excluded.image,\
              importing = excluded.importing;',
            [user.id, user.name, user.image, true],
          );
          res();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  public async setImporting(userId: string, value: boolean) {
    return new Promise((res, reject) => {
      DBConnection.getInstance().getClient(async (client) => {
        try {
          await client.query(
            'UPDATE user_data\
              SET importing=$2\
              WHERE id=$1;',
            [userId, value],
          );
          res();
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
