import {Track, YoutubeTracks} from 'models';

import {getBig, getMedium, getSmall} from './util';

export const normalizeTracks = (tracks: YoutubeTracks): Track[] => {
  return tracks.items.map((item) => {
    const {thumbnails} = item.snippet;

    return {
      id: item.snippet.resourceId.videoId,
      name: item.snippet.title,
      channel: item.snippet.channelTitle,
      cover: {
        small: getSmall(thumbnails).url,
        medium: getMedium(thumbnails).url,
        big: getBig(thumbnails).url,
      },
    };
  });
};
