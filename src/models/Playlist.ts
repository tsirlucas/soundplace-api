import {SpotifyPlaylists} from './SpotifyPlaylists';

export type Playlist = {
  id: SpotifyPlaylists['items'][0]['id'];
  name: SpotifyPlaylists['items'][0]['name'];
  cover: SpotifyPlaylists['items'][0]['images'][0]['url'];
};
