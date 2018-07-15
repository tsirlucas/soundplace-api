import {Playlist, SpotifyPlaylists} from 'models';

export const normalizePlaylists = (playlists: SpotifyPlaylists): Playlist[] => {
  return playlists.items.map((item) => {
    return {
      id: item.id,
      name: item.name,
      cover: item.images[0].url,
    };
  });
};

export const normalizePlaylist = (playlist: SpotifyPlaylists['items'][0]): Playlist => {
  return {
    id: playlist.id,
    name: playlist.name,
    cover: playlist.images[0].url,
  };
};
