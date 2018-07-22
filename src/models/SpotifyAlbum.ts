import {SpotifyImage} from './SpotifyImage';

export type SpotifyAlbum = {
  id: string;
  images: SpotifyImage[];
  name: string;
};
