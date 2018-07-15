import {SpotifyTracks} from './SpotifyTracks';

export type Track = {
  id: SpotifyTracks['items'][0]['track']['id'];
  name: SpotifyTracks['items'][0]['track']['name'];
  album: {
    name: SpotifyTracks['items'][0]['track']['album']['name'];
    cover: SpotifyTracks['items'][0]['track']['album']['images'][0]['url'];
  };
  artist: SpotifyTracks['items'][0]['track']['artists'][0];
  duration: SpotifyTracks['items'][0]['track']['duration_ms'];
};
