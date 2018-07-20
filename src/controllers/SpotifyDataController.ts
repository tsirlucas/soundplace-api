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
    const {authorization} = req.headers;
    const user = await SpotifyDataService.getInstance().getUserData(authorization);
    res.send({data: user});
  }

  public async getUserPlaylists(req: Request, res: Response) {
    const {authorization} = req.headers;

    const playlists = await SpotifyDataService.getInstance().getUserPlaylists(authorization);
    res.send({data: playlists});
  }

  public async getPlaylistTracks(req: Request, res: Response) {
    try {
      const {playlist} = req.params;
      const {authorization} = req.headers;
      const {id} = await SpotifyDataService.getInstance().getUserData(authorization);
      const playlistObj = await SpotifyDataService.getInstance().getPlaylist(
        id,
        playlist,
        authorization,
      );
      const tracks = await SpotifyDataService.getInstance().getPlaylistTracks(
        id,
        playlist,
        authorization,
      );

      const result = normalizePlaylistTracks(playlistObj, tracks);

      res.send({data: result});
    } catch (e) {
      throw e;
    }
  }
}
