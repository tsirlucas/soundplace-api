import axios, {AxiosInstance} from 'axios';
import {Request} from 'express';
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

  public async getUserData(req: Request) {
    try {
      const {data} = await this.axiosInstance.get('/me', {
        headers: {
          Authorization: req.headers.authorization,
          Accept: 'application/json',
        },
      });
      return normalizeUser(data);
    } catch (e) {
      throw e;
    }
  }

  public async getUserPlaylists(req: Request) {
    try {
      const {data} = await this.axiosInstance.get('/me/playlists', {
        headers: {
          Authorization: req.headers.authorization,
          Accept: 'application/json',
        },
      });
      return normalizePlaylists(data);
    } catch (e) {
      throw e;
    }
  }

  public async getPlaylist(req: Request, userId: string) {
    try {
      const {playlist} = req.params;

      const {data} = await this.axiosInstance.get(`/users/${userId}/playlists/${playlist}`, {
        headers: {
          Authorization: req.headers.authorization,
          Accept: 'application/json',
        },
      });
      return normalizePlaylist(data);
    } catch (e) {
      throw e;
    }
  }

  public async getPlaylistTracks(req: Request, userId: string) {
    try {
      const {playlist} = req.params;
      const {data} = await this.axiosInstance.get(`/users/${userId}/playlists/${playlist}/tracks`, {
        headers: {
          Authorization: req.headers.authorization,
          Accept: 'application/json',
        },
      });
      return normalizeTracks(data);
    } catch (e) {
      throw e;
    }
  }
}
