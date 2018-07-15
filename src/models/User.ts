import {SpotifyUser} from './SpotifyUser';

export type User = {
  id: SpotifyUser['id'];
  name: SpotifyUser['display_name'];
  image: SpotifyUser['images'][0]['url'];
};
