import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {environment} from 'config';
import {YoutubeAuth} from 'db';
import {normalizePlaylist, normalizePlaylists, normalizeTracks, normalizeUser} from 'schemas';

import {YoutubeTracks} from 'src/models';

export class YoutubeDataService {
  private static instance: YoutubeDataService;

  private endpoint = 'https://www.googleapis.com';

  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.endpoint,
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new YoutubeDataService();
    }

    return this.instance;
  }

  private async get(path: string, userId: string): Promise<AxiosResponse<any>> {
    const token = await YoutubeAuth.getInstance().getToken(userId);
    try {
      const result = await this.axiosInstance.get(path, {
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
        },
      });

      return result;
    } catch (e) {
      if (e.response.data.error.message === 'Invalid Credentials') {
        await axios.get(
          `${environment.settings.authEndpoint}/youtube/refreshToken?userId=${userId}`,
        );
        return this.get(path, userId);
      }
      throw e;
    }
  }

  public async getUserData(userId: string) {
    try {
      const {data} = await this.get('/oauth2/v1/userinfo', userId);
      return normalizeUser(data);
    } catch (e) {
      throw e;
    }
  }

  public async getUserPlaylists(userId: string) {
    try {
      const {data} = await this.get(
        '/youtube/v3/playlists?maxResults=50&part=snippet&mine=true',
        userId,
      );
      return normalizePlaylists(data);
    } catch (e) {
      throw e;
    }
  }

  public async getPlaylist(userId: string, playlistId: string) {
    try {
      const {data} = await this.get(`/youtube/v3/playlists?part=snippet&id=${playlistId}`, userId);
      return normalizePlaylist(data);
    } catch (e) {
      throw e;
    }
  }

  public async getPlaylistTracks(userId: string, playlistId: string) {
    try {
      const {data}: {data: YoutubeTracks} = await this.get(
        `/youtube/v3/playlistItems?maxResults=50&part=snippet&playlistId=${playlistId}`,
        userId,
      );

      const videoIds = data.items.map((item) => item.snippet.resourceId.videoId);

      const videosRes = await this.get(
        `/youtube/v3/videos?id=${videoIds.join(',')}&part=snippet&maxResults=50`,
        userId,
      );

      data.items = data.items.map((item, index) => {
        item.snippet.channelId = videosRes.data.items[index].snippet.channelId;
        item.snippet.channelTitle = videosRes.data.items[index].snippet.channelTitle;
        return item;
      });

      return normalizeTracks(data);
    } catch (e) {
      throw e;
    }
  }
}
