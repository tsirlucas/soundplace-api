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

  private async recursiveGet(userId: string, url: string) {
    const {data} = await this.get(url, userId);
    if (data.nextPageToken) {
      const nextPageUrl = `${url}&pageToken=${data.nextPageToken}`;
      const recursiveData = await this.recursiveGet(userId, nextPageUrl);
      data.items = [...data.items, ...recursiveData.items];
    }
    return data;
  }

  public async getUserPlaylists(userId: string) {
    try {
      const data = await this.recursiveGet(
        userId,
        '/youtube/v3/playlists?maxResults=50&part=snippet&mine=true',
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

  private async sliceIdsAndGetVideos(userId: string, ids: string[]) {
    const perChunk = 50;
    const chunkedIds = ids.reduce(
      (curr, next, index) => {
        const chunkIndex = Math.floor(index / perChunk);

        if (!curr[chunkIndex]) {
          curr[chunkIndex] = []; // start a new chunk
        }

        curr[chunkIndex].push(next);

        return curr;
      },
      [] as string[][],
    );

    const results = await Promise.all(
      chunkedIds.map(async (ids) => {
        const {data} = await this.get(
          `/youtube/v3/videos?id=${ids.join(',')}&part=snippet&maxResults=50`,
          userId,
        );
        return data;
      }),
    );
    return results.reduce(
      (curr, next) => {
        curr.items = [...curr.items, ...next.items];
        return curr;
      },
      {items: []},
    );
  }

  public async getPlaylistTracks(userId: string, playlistId: string) {
    try {
      const url = `/youtube/v3/playlistItems?maxResults=50&part=snippet&playlistId=${playlistId}`;
      const data: YoutubeTracks = await this.recursiveGet(userId, url);
      const videoIds = data.items.map((item) => item.snippet.resourceId.videoId);
      const videosRes = await this.sliceIdsAndGetVideos(userId, videoIds);

      const indexedVideos = videosRes.items.reduce((curr: any, next: any) => {
        curr[next.id] = next;
        return curr;
      }, {});

      data.items = data.items
        .filter((i) => indexedVideos[i.snippet.resourceId.videoId])
        .map((item) => {
          item.snippet.channelId = indexedVideos[item.snippet.resourceId.videoId].snippet.channelId;
          item.snippet.channelTitle =
            indexedVideos[item.snippet.resourceId.videoId].snippet.channelTitle;
          return item;
        });

      return normalizeTracks(data);
    } catch (e) {
      throw e;
    }
  }
}
