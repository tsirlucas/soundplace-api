import {SubscriptionController} from 'controllers';
import {Router} from 'express';

export const subscriptionRouter = Router();

subscriptionRouter
  .get('/user', SubscriptionController.getInstance().subscribeToUser)
  .get('/playlists', SubscriptionController.getInstance().subscribeToPlaylists)
  .get('/playlistsTracks', SubscriptionController.getInstance().subscribeToPlaylistTracks)
  .get('/stop', SubscriptionController.getInstance().stopSubscription);
