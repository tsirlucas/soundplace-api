import {SpotifyDataController} from 'controllers';
import {Router} from 'express';

export const dataRouter = Router();

dataRouter.get('/me', SpotifyDataController.getInstance().getUserData);

dataRouter.get('/me/playlists', SpotifyDataController.getInstance().getUserPlaylists);

dataRouter.get(
  '/playlists/:playlist/tracks',
  SpotifyDataController.getInstance().getPlaylistTracks,
);
