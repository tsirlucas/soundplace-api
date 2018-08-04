import {PoolClient} from 'pg';

import {DBTrack, Track} from 'models';

export class YoutubeTrackUpdater {
  private static instance: YoutubeTrackUpdater;

  static getInstance() {
    if (!this.instance) {
      this.instance = new YoutubeTrackUpdater();
    }

    return this.instance;
  }

  private async setTrack(client: PoolClient, track: Track) {
    try {
      await client.query(
        'INSERT INTO track_data (id, name, channel)\
          VALUES ($1, $2, $3)\
          ON CONFLICT (id) DO UPDATE\
          SET name = excluded.name,\
          channel = excluded.channel;',
        [track.id, track.name, track.channel],
      );
    } catch (e) {
      throw e;
    }
  }

  public async setCover(client: PoolClient, cover: Track['cover'], trackId: string) {
    try {
      await client.query(
        'INSERT INTO cover_data (track_id, small, medium, big)\
          VALUES ($1, $2, $3, $4)\
          ON CONFLICT (track_id) DO UPDATE\
          SET small = excluded.small,\
          medium = excluded.medium,\
          big = excluded.big;',
        [trackId, cover.small, cover.medium, cover.big],
      );
    } catch (e) {
      throw e;
    }
  }

  private async setRelationship(client: PoolClient, trackId: string, playlistId: string) {
    try {
      await client.query(
        'INSERT INTO playlist_track (track_id, playlist_id)\
          VALUES ($1, $2)\
          ON CONFLICT (track_id, playlist_id) DO NOTHING;',
        [trackId, playlistId],
      );
    } catch (e) {
      throw e;
    }
  }

  private async splitAndSetTrack(client: PoolClient, track: Track, playlistId: string) {
    try {
      await this.setTrack(client, track);
      await this.setCover(client, track.cover, track.id);
      await this.setRelationship(client, track.id, playlistId);
    } catch (e) {
      throw e;
    }
  }

  private async clearRemovedTracks(client: PoolClient, tracks: Track[], playlistId: string) {
    try {
      const {rows} = await client.query('SELECT * FROM playlist_track WHERE playlist_id=$1;', [
        playlistId,
      ]);
      const newTracksIds = tracks.map((track) => track.id);

      const deletedTracks = rows.filter((dbTrack: DBTrack) => newTracksIds.indexOf(dbTrack.id) < 0);

      await Promise.all(
        deletedTracks.map(async (dbTrack: DBTrack) => {
          await client.query('DELETE FROM playlist_track WHERE track_id=$1 AND playlist_id=$2;', [
            dbTrack.id,
            playlistId,
          ]);
        }),
      );
    } catch (e) {
      throw e;
    }
  }

  public async setTracks(client: PoolClient, tracks: Track[], playlistId: string) {
    return new Promise(async (res, reject) => {
      try {
        await this.clearRemovedTracks(client, tracks, playlistId);
        await Promise.all(tracks.map((track) => this.splitAndSetTrack(client, track, playlistId)));

        res();
      } catch (e) {
        reject(e);
      }
    });
  }
}
