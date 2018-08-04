import {Request, Response} from 'express';
import {normalizePlaylistTracks} from 'schemas';

import {YoutubeDataService} from 'services';

export class YoutubeDataController {
  private static instance: YoutubeDataController;

  static getInstance() {
    if (!this.instance) {
      this.instance = new YoutubeDataController();
    }

    return this.instance;
  }

  public async getUserData(_req: Request, res: Response) {
    const {userId} = res.locals;

    const user = await YoutubeDataService.getInstance().getUserData(userId);
    res.send({data: user});
  }

  public async getUserPlaylists(_req: Request, res: Response) {
    const {userId} = res.locals;

    const playlists = await YoutubeDataService.getInstance().getUserPlaylists(userId);
    res.send({data: playlists});
  }

  public async getPlaylistTracks(req: Request, res: Response) {
    try {
      const {playlist} = req.params;
      const {userId} = res.locals;

      const playlistObj = await YoutubeDataService.getInstance().getPlaylist(userId, playlist);
      const tracks = await YoutubeDataService.getInstance().getPlaylistTracks(userId, playlist);

      const result = normalizePlaylistTracks(playlistObj, tracks);

      res.send({data: result});
    } catch (e) {
      throw e;
    }
  }
}
