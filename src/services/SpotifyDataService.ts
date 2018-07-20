import axios, {AxiosInstance} from 'axios';
import {normalizePlaylist, normalizePlaylists, normalizeTracks, normalizeUser} from 'schemas';

export class SpotifyDataService {
  private static instance: SpotifyDataService;

  private endpoint = 'https://api.spotify.com/v1';

  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.endpoint,
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyDataService();
    }

    return this.instance;
  }

  public async getUserData(authorization: string | undefined) {
    try {
      const {data} = await this.axiosInstance.get('/me', {
        headers: {
          Authorization: authorization,
          Accept: 'application/json',
        },
      });
      return normalizeUser(data);
    } catch (e) {
      throw e;
    }
  }

  public async getUserPlaylists(authorization: string | undefined) {
    try {
      const {data} = await this.axiosInstance.get(
        '/me/playlists?fields=items(id,name,images(url))',
        {
          headers: {
            Authorization: authorization,
            Accept: 'application/json',
          },
        },
      );
      return normalizePlaylists(data);
    } catch (e) {
      throw e;
    }
  }

  public async getPlaylist(userId: string, playlistId: string, authorization: string | undefined) {
    try {
      const {data} = await this.axiosInstance.get(
        `/users/${userId}/playlists/${playlistId}?fields=id,name,images(url)`,
        {
          headers: {
            Authorization: authorization,
            Accept: 'application/json',
          },
        },
      );
      return normalizePlaylist(data);
    } catch (e) {
      throw e;
    }
  }

  public async getPlaylistTracks(
    userId: string,
    playlistId: string,
    authorization: string | undefined,
  ) {
    try {
      const {data} = await this.axiosInstance.get(
        `/users/${userId}/playlists/${playlistId}/tracks?fields=items(track(id,name,album(id,name,images(url)),artists(id,name),duration_ms))`,
        {
          headers: {
            Authorization: authorization,
            Accept: 'application/json',
          },
        },
      );
      return normalizeTracks(data);
    } catch (e) {
      throw e;
    }
  }
}
