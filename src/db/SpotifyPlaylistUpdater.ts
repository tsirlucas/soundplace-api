import {PoolClient} from 'pg';

import {DBPlaylist, Playlist} from 'models';

import {DBConnection} from './DBConnection';

export class SpotifyPlaylistUpdater {
  private static instance: SpotifyPlaylistUpdater;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyPlaylistUpdater();
    }

    return this.instance;
  }

  private playlistComparison(dbPlaylist: DBPlaylist, playlist: Playlist) {
    const didNameChange = dbPlaylist.name !== playlist.name;
    const didCoverChange = dbPlaylist.cover !== playlist.cover;

    return didNameChange || didCoverChange;
  }

  private async setPlaylist(client: PoolClient, playlist: Playlist, userId: string) {
    try {
      const {rows} = await client.query('SELECT * FROM playlist_data WHERE id=$1', [playlist.id]);

      if (!rows[0] || this.playlistComparison(rows[0], playlist))
        client.query(
          'INSERT INTO playlist_data (id, name, cover, user_id)\
          VALUES ($1, $2, $3, $4)\
          ON CONFLICT (id) DO UPDATE\
          SET name = excluded.name,\
          cover = excluded.cover,\
          user_id = excluded.user_id;',
          [playlist.id, playlist.name, playlist.cover, userId],
        );
    } catch (e) {
      throw e;
    }
  }

  public async setPlaylists(playlists: Playlist[], userId: string) {
    return new Promise((res, reject) => {
      DBConnection.getInstance().getClient(async (err, client) => {
        if (!err) {
          res(
            Promise.all(
              playlists.map((playlist) => this.setPlaylist(client, playlist, userId)),
            ).catch((e) => reject(e)),
          );
        }

        reject(err);
      });
    });
  }
}
