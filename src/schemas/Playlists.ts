import {Playlist, YoutubePlaylists} from 'models';

import {getBig, getMedium, getSmall} from './util';

export const normalizePlaylists = (playlists: YoutubePlaylists): Playlist[] => {
  return playlists.items.map((item) => {
    const {thumbnails} = item.snippet;

    return {
      id: item.id,
      name: item.snippet.title,
      cover: {
        small: getSmall(thumbnails).url,
        medium: getMedium(thumbnails).url,
        big: getBig(thumbnails).url,
      },
    };
  });
};

export const normalizePlaylist = (payload: YoutubePlaylists): Playlist => {
  const playlist = payload.items[0];

  const {thumbnails} = playlist.snippet;

  return {
    id: playlist.id,
    name: playlist.snippet.title,
    cover: {
      small: getSmall(thumbnails).url,
      medium: getMedium(thumbnails).url,
      big: getBig(thumbnails).url,
    },
  };
};
