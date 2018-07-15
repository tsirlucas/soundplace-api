import {Playlist, Track} from 'models';

export const normalizePlaylistTracks = (playlist: Playlist, tracks: Track[]) => {
  return {
    ...playlist,
    tracks: tracks,
  };
};
