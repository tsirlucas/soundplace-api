import {User} from 'models';

import {DBConnection} from './DBConnection';

export class SpotifyUserUpdater {
  private static instance: SpotifyUserUpdater;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyUserUpdater();
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
