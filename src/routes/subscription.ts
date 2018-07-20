import {SubscriptionController} from 'controllers';
import {Router} from 'express';

export const subscriptionRouter = Router();

subscriptionRouter.get('/playlists', SubscriptionController.getInstance().subscribeToPlaylists);

subscriptionRouter.get(
  '/playlistsTracks',
  SubscriptionController.getInstance().subscribeToPlaylistTracks,
);

subscriptionRouter.get('/stop', SubscriptionController.getInstance().stopSubscription);
