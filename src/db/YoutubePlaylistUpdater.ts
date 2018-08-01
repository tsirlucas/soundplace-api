import {PoolClient} from 'pg';

import {DBPlaylist, Playlist, Track} from 'models';

import {DBConnection} from './DBConnection';
import {YoutubeTrackUpdater} from './YoutubeTrackUpdater';

export class YoutubePlaylistUpdater {
  private static instance: YoutubePlaylistUpdater;

  static getInstance() {
    if (!this.instance) {
      this.instance = new YoutubePlaylistUpdater();
    }

    return this.instance;
  }

  private async setPlaylist(client: PoolClient, playlist: Playlist, userId: string) {
    try {
      await client.query(
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

  private async clearRemovedPlaylists(client: PoolClient, playlists: Playlist[], userId: string) {
    try {
      const {rows} = await client.query('SELECT * FROM playlist_data WHERE user_id=$1;', [userId]);
      const newPlaylistsIds = playlists.map((playlist) => playlist.id);

      const deletedPlaylists = rows.filter(
        (dbPlaylist: DBPlaylist) => newPlaylistsIds.indexOf(dbPlaylist.id) < 0,
      );

      await Promise.all(
        deletedPlaylists.map((dbPlaylist: DBPlaylist) => {
          return client.query('DELETE FROM playlist_data WHERE id=$1;', [dbPlaylist.id]);
        }),
      );
    } catch (e) {
      throw e;
    }
  }

  public async setPlaylists(playlists: Playlist[], userId: string) {
    return new Promise((res, reject) => {
      DBConnection.getInstance().getClient(async (client) => {
        try {
          await this.clearRemovedPlaylists(client, playlists, userId);
          await Promise.all(
            playlists.map((playlist) => this.setPlaylist(client, playlist, userId)),
          );
          res();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  public async setPlaylistTracks(playlist: Playlist, tracks: Track[], userId: string) {
    return new Promise((res, reject) => {
      DBConnection.getInstance().getClient(async (client) => {
        try {
          await this.setPlaylist(client, playlist, userId);
          await YoutubeTrackUpdater.getInstance().setTracks(client, tracks, playlist.id);
          res();
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
