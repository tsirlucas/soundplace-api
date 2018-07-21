import {PoolClient} from 'pg';

import {Album, Artist, DBAlbum, DBTrack, Track} from 'models';

import {DBConnection} from './DBConnection';

export class SpotifyTrackUpdater {
  private static instance: SpotifyTrackUpdater;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyTrackUpdater();
    }

    return this.instance;
  }

  private albumComparison(dbAlbum: DBAlbum, album: Album) {
    const didNameChange = dbAlbum.name !== album.name;
    const didCoverChange = dbAlbum.cover !== album.cover;

    return didNameChange || didCoverChange;
  }

  private async setAlbum(client: PoolClient, album: Album) {
    try {
      const {rows} = await client.query('SELECT * FROM album_data WHERE id=$1', [album.id]);

      if (!rows[0] || this.albumComparison(rows[0], album)) {
        await client.query(
          'INSERT INTO album_data (id, name, cover)\
          VALUES ($1, $2, $3)\
          ON CONFLICT (id) DO UPDATE\
          SET name = excluded.name,\
          cover = excluded.cover;',
          [album.id, album.name, album.cover],
        );
      }
    } catch (e) {
      throw e;
    }
  }

  private async setArtist(client: PoolClient, artist: Artist) {
    try {
      const {rows} = await client.query('SELECT * FROM artist_data WHERE id=$1', [artist.id]);

      if (!rows[0] || rows[0].name !== artist.name) {
        await client.query(
          'INSERT INTO artist_data (id, name)\
          VALUES ($1, $2)\
          ON CONFLICT (id) DO UPDATE\
          SET name = excluded.name;',
          [artist.id, artist.name],
        );
      }
    } catch (e) {
      throw e;
    }
  }

  private trackComparison(dbTrack: DBTrack, track: Track) {
    const didNameChange = dbTrack.name !== track.name;
    const didAlbumChange = dbTrack.album_id !== track.album.id;
    const didDuration = dbTrack.duration !== dbTrack.duration;

    return didNameChange || didAlbumChange || didDuration;
  }

  private async setTrack(client: PoolClient, track: Track) {
    try {
      const {rows} = await client.query('SELECT * FROM track_data WHERE id=$1', [track.id]);

      if (!rows[0] || this.trackComparison(rows[0], track)) {
        await client.query(
          'INSERT INTO track_data (id, name, duration, artist_id, album_id)\
          VALUES ($1, $2, $3, $4)\
          ON CONFLICT (id) DO UPDATE\
          SET name = excluded.name,\
          duration = excluded.duration,\
          artist_id = excluded.artist_id,\
          album_id = excluded.album_id;',
          [track.id, track.name, track.duration, track.artist.id, track.album.id],
        );
      }
    } catch (e) {
      throw e;
    }
  }

  private async setRelationship(client: PoolClient, trackId: string, playlistId: string) {
    try {
      await client.query(
        'INSERT INTO playlist_track (track_id, playlist_id)\
          VALUES ($1, $2)\
          ON CONFLICT (playlist_track_pkey) DO NOTHING;',
        [trackId, playlistId],
      );
    } catch (e) {
      throw e;
    }
  }

  private async splitAndSetTrack(client: PoolClient, track: Track, playlistId: string) {
    try {
      await this.setArtist(client, track.artist);
      await this.setAlbum(client, track.album);
      await this.setTrack(client, track);
      await this.setRelationship(client, track.id, playlistId);
    } catch (e) {
      throw e;
    }
  }

  private async clearRemovedTracks(client: PoolClient, tracks: Track[], playlistId: string) {
    try {
      const {rows} = await client.query('SELECT * FROM playlist_track WHERE playlist_id=$1);', [
        playlistId,
      ]);
      const newTracksIds = tracks.map((track) => track.id);

      const deletedTracks = rows.filter((dbTrack: DBTrack) => newTracksIds.indexOf(dbTrack.id) < 0);

      await Promise.all(
        deletedTracks.map((dbTrack: DBTrack) => {
          return client.query('DELETE FROM playlist_track WHERE track_id=$1 AND playlist_id=$2;', [
            dbTrack.id,
            playlistId,
          ]);
        }),
      );
    } catch (e) {
      throw e;
    }
  }

  public async setTracks(tracks: Track[], playlistId: string) {
    return new Promise((res, reject) => {
      DBConnection.getInstance().getClient(async (client) => {
        try {
          await this.clearRemovedTracks(client, tracks, playlistId);
          await Promise.all(
            tracks.map((track) => this.splitAndSetTrack(client, track, playlistId)),
          );

          res();
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
