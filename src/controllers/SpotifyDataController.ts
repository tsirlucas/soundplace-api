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

  public async getUserData(req: Request, res: Response) {
    const user = await SpotifyDataService.getInstance().getUserData(req);
    res.send({data: user});
  }

  public async getUserPlaylists(req: Request, res: Response) {
    const playlists = await SpotifyDataService.getInstance().getUserPlaylists(req);
    res.send({data: playlists});
  }

  public async getPlaylistTracks(req: Request, res: Response) {
    try {
      const {id} = await SpotifyDataService.getInstance().getUserData(req);
      const playlist = await SpotifyDataService.getInstance().getPlaylist(req, id);
      const tracks = await SpotifyDataService.getInstance().getPlaylistTracks(req, id);

      const result = normalizePlaylistTracks(playlist, tracks);

      res.send({data: result});
    } catch (e) {
      throw e;
    }
  }
}
