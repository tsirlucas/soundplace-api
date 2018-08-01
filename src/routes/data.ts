import {YoutubeDataController} from 'controllers';
import {Router} from 'express';

export const dataRouter = Router();

dataRouter
  .get('/me', YoutubeDataController.getInstance().getUserData)
  .get('/me/playlists', YoutubeDataController.getInstance().getUserPlaylists)
  .get('/playlists/:playlist/tracks', YoutubeDataController.getInstance().getPlaylistTracks);
