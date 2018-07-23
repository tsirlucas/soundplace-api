import {SpotifyPlaylistUpdater, SpotifyUserUpdater} from 'db';
import {Request, Response} from 'express';

import {SpotifyDataService, SubscriptionDaemonService} from 'services';

export class SubscriptionController {
  private static instance: SubscriptionController;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SubscriptionController();
    }

    return this.instance;
  }

  public subscribeToUser(_req: Request, res: Response) {
    const poolId = SubscriptionDaemonService.getInstance().run(async () => {
      const user = await SpotifyDataService.getInstance().getUserData(res.locals.userId);
      await SpotifyUserUpdater.getInstance().setUser(user);
    });
    res.send({poolId: poolId});
  }

  public async subscribeToPlaylists(_req: Request, res: Response) {
    const {userId} = res.locals;

    const poolId = SubscriptionDaemonService.getInstance().run(async () => {
      const playlists = await SpotifyDataService.getInstance().getUserPlaylists(userId);
      await SpotifyPlaylistUpdater.getInstance().setPlaylists(playlists, userId);
    });
    res.send({poolId: poolId});
  }

  public async subscribeToPlaylistTracks(req: Request, res: Response) {
    const {playlistId} = req.query;
    const {userId} = res.locals;

    const poolId = `${userId}${playlistId}`;

    SubscriptionDaemonService.getInstance().runWithoutRepetition(poolId, async () => {
      const playlist = await SpotifyDataService.getInstance().getPlaylist(userId, playlistId);
      const tracks = await SpotifyDataService.getInstance().getPlaylistTracks(userId, playlistId);

      await SpotifyPlaylistUpdater.getInstance().setPlaylistTracks(playlist, tracks, userId);
    });
    res.send({poolId: poolId});
  }

  public async stopSubscription(req: Request, res: Response) {
    const {poolId} = req.query;
    SubscriptionDaemonService.getInstance().stop(poolId);
    res.send({poolId: poolId});
  }
}
