import {SpotifyAlbum} from './SpotifyAlbum';
import {SpotifyArtist} from './SpotifyArtist';

export type SpotifyTrack = {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  id: string;
  name: string;
  duration_ms: number;
};

export type SpotifyTracks = {
  href: string;
  items: {
    track: SpotifyTrack;
  }[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};
