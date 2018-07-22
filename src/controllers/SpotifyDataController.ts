import {Request, Response} from 'express';
import {normalizePlaylistTracks} from 'schemas';

import {SpotifyDataService} from 'services';

export class SpotifyDataController {
  private static instance: SpotifyDataController;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyDataController();
    }

    return this.instance;
  }

  public async getUserData(_req: Request, res: Response) {
    const {userId} = res.locals;

    const user = await SpotifyDataService.getInstance().getUserData(userId);
    res.send({data: user});
  }

  public async getUserPlaylists(_req: Request, res: Response) {
    const {userId} = res.locals;

    const playlists = await SpotifyDataService.getInstance().getUserPlaylists(userId);
    res.send({data: playlists});
  }

  public async getPlaylistTracks(req: Request, res: Response) {
    try {
      const {playlist} = req.params;
      const {userId} = res.locals;

      const playlistObj = await SpotifyDataService.getInstance().getPlaylist(userId, playlist);
      const tracks = await SpotifyDataService.getInstance().getPlaylistTracks(userId, playlist);

      const result = normalizePlaylistTracks(playlistObj, tracks);

      res.send({data: result});
    } catch (e) {
      throw e;
    }
  }
}
