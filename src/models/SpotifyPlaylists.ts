import {SpotifyImage} from './SpotifyImage';

export type SpotifyPlaylists = {
  href: string;
  items: {
    id: string;
    images: {
      url: SpotifyImage['url'];
    }[];
    name: string;
  }[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};
