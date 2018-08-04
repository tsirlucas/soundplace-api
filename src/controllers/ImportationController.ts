import {YoutubePlaylistUpdater, YoutubeUserUpdater} from 'db';
import {Request, Response} from 'express';

import {Playlist} from 'models';
import {YoutubeDataService} from 'services';

export class SubscriptionController {
  private static instance: SubscriptionController;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SubscriptionController();
    }

    return this.instance;
  }

  private async importUser(_req: Request, res: Response) {
    const user = await YoutubeDataService.getInstance().getUserData(res.locals.userId);
    await YoutubeUserUpdater.getInstance().setUser(user);
    res.send();
  }

  private async importPlaylistTracks(userId: string, playlists: Playlist[]) {
    await Promise.all(
      playlists.map(async (playlist) => {
        const tracks = await YoutubeDataService.getInstance().getPlaylistTracks(
          userId,
          playlist.id,
        );
        await YoutubePlaylistUpdater.getInstance().setPlaylistTracks(playlist, tracks, userId);
      }),
    );
  }

  private async importPlaylists(_req: Request, res: Response) {
    const {userId} = res.locals;

    const playlists = await YoutubeDataService.getInstance().getUserPlaylists(userId);
    await YoutubePlaylistUpdater.getInstance().setPlaylists(playlists, userId);
    await this.importPlaylistTracks(userId, playlists);
    res.send();
  }

  public importData = async (req: Request, res: Response) => {
    await this.importUser(req, res);
    await this.importPlaylists(req, res);
    await YoutubeUserUpdater.getInstance().setImporting(res.locals.userId, false);
  };
}
