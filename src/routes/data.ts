import {SpotifyDataController} from 'controllers';
import {Router} from 'express';

export const dataRouter = Router();

dataRouter
  .get('/me', SpotifyDataController.getInstance().getUserData)
  .get('/me/playlists', SpotifyDataController.getInstance().getUserPlaylists)
  .get('/playlists/:playlist/tracks', SpotifyDataController.getInstance().getPlaylistTracks);
