import {SpotifyPlaylistUpdater, SpotifyTrackUpdater, SpotifyUserUpdater} from 'db';
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

  public subscribeToUser(req: Request, res: Response) {
    const {authorization} = req.headers;

    const poolId = SubscriptionDaemonService.getInstance().run(async () => {
      const user = await SpotifyDataService.getInstance().getUserData(authorization);
      await SpotifyUserUpdater.getInstance().setUser(user);
    });
    res.send({poolId: poolId});
  }

  public async subscribeToPlaylists(req: Request, res: Response) {
    const {authorization} = req.headers;
    const {userId} = req.params;

    const poolId = SubscriptionDaemonService.getInstance().run(async () => {
      const playlists = await SpotifyDataService.getInstance().getUserPlaylists(authorization);
      await SpotifyPlaylistUpdater.getInstance().setPlaylists(playlists, userId);
    });
    res.send({poolId: poolId});
  }

  public async subscribeToPlaylistTracks(req: Request, res: Response) {
    const {userId, playlistId} = req.params;
    const {authorization} = req.headers;

    const poolId = `${userId}${playlistId}`;

    SubscriptionDaemonService.getInstance().runWithoutRepetition(poolId, async () => {
      const playlist = await SpotifyDataService.getInstance().getPlaylist(
        userId,
        playlistId,
        authorization,
      );
      const tracks = await SpotifyDataService.getInstance().getPlaylistTracks(
        userId,
        playlistId,
        authorization,
      );

      await SpotifyPlaylistUpdater.getInstance().setPlaylists([playlist], userId);
      await SpotifyTrackUpdater.getInstance().setTracks(tracks, playlist.id);
    });
    res.send({poolId: poolId});
  }

  public async stopSubscription(req: Request, res: Response) {
    const {poolId} = req.params;
    SubscriptionDaemonService.getInstance().stop(poolId);
    res.send({poolId: poolId});
  }
}
