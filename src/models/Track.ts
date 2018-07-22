import {Album} from './Album';
import {Artist} from './Artist';
import {SpotifyTracks} from './SpotifyTracks';

export type Track = {
  id: SpotifyTracks['items'][0]['track']['id'];
  name: SpotifyTracks['items'][0]['track']['name'];
  album: Album;
  artist: Artist;
  duration: SpotifyTracks['items'][0]['track']['duration_ms'];
};
