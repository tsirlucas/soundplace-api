import {SpotifyAlbum} from './SpotifyAlbum';

export type Album = {
  id: SpotifyAlbum['id'];
  name: SpotifyAlbum['name'];
  cover: SpotifyAlbum['images'][0]['url'];
};
