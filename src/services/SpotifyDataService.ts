import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {environment} from 'config';
import {SpotifyAuth} from 'db';
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

  private async get(path: string, userId: string): Promise<AxiosResponse<any>> {
    const token = await SpotifyAuth.getInstance().getToken(userId);
    try {
      const result = await this.axiosInstance.get(path, {
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
        },
      });
      return result;
    } catch (e) {
      if (e.response.data.error.message === 'Only valid bearer authentication supported') {
        await axios.get(
          `${environment.settings.authEndpoint}/spotify/refreshToken?userId=${userId}`,
        );
        return this.get(path, userId);
      }

      throw e;
    }
  }

  public async getUserData(userId: string) {
    try {
      const {data} = await this.get('/me', userId);
      return normalizeUser(data);
    } catch (e) {
      throw e;
    }
  }

  public async getUserPlaylists(userId: string) {
    try {
      const {data} = await this.get('/me/playlists?fields=items(id,name,images(url))', userId);
      return normalizePlaylists(data);
    } catch (e) {
      throw e;
    }
  }

  public async getPlaylist(userId: string, playlistId: string) {
    try {
      const {data} = await this.get(
        `/users/${userId}/playlists/${playlistId}?fields=id,name,images(url)`,
        userId,
      );
      return normalizePlaylist(data);
    } catch (e) {
      throw e;
    }
  }

  public async getPlaylistTracks(userId: string, playlistId: string) {
    try {
      const {data} = await this.get(
        `/users/${userId}/playlists/${playlistId}/tracks?fields=items(track(id,name,album(id,name,images(url)),artists(id,name),duration_ms))`,
        userId,
      );
      return normalizeTracks(data);
    } catch (e) {
      throw e;
    }
  }
}
