import {Playlist, YoutubePlaylists} from 'models';

export const normalizePlaylists = (playlists: YoutubePlaylists): Playlist[] => {
  return playlists.items.map((item) => {
    return {
      id: item.id,
      name: item.snippet.title,
      cover: item.snippet.thumbnails.default.url,
    };
  });
};

export const normalizePlaylist = (payload: YoutubePlaylists): Playlist => {
  const playlist = payload.items[0];

  return {
    id: playlist.id,
    name: playlist.snippet.title,
    cover: playlist.snippet.thumbnails.default.url,
  };
};
