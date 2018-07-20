import {SpotifyTracks, Track} from 'models';

export const normalizeTracks = (tracks: SpotifyTracks): Track[] => {
  return tracks.items.map(({track}) => ({
    id: track.id,
    name: track.name,
    album: {
      id: track.album.id,
      name: track.album.name,
      cover: track.album.images[0].url,
    },
    artist: track.artists[0],
    duration: track.duration_ms,
  }));
};
