import {Playlist, YoutubePlaylists} from 'models';

export const normalizePlaylists = (playlists: YoutubePlaylists): Playlist[] => {
  return playlists.items.map((item) => {
    return {
      id: item.id,
      name: item.snippet.title,
      cover: {
        small: item.snippet.thumbnails.default.url,
        medium: item.snippet.thumbnails.high.url,
        big: item.snippet.thumbnails.maxres.url,
      },
    };
  });
};

export const normalizePlaylist = (payload: YoutubePlaylists): Playlist => {
  const playlist = payload.items[0];

  return {
    id: playlist.id,
    name: playlist.snippet.title,
    cover: {
      small: playlist.snippet.thumbnails.default.url,
      medium: playlist.snippet.thumbnails.high.url,
      big: playlist.snippet.thumbnails.maxres.url,
    },
  };
};
