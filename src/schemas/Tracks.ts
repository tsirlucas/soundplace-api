import {Track, YoutubeTracks} from 'models';

export const normalizeTracks = (tracks: YoutubeTracks): Track[] => {
  return tracks.items.map((item) => ({
    id: item.snippet.resourceId.videoId,
    name: item.snippet.title,
    channel: item.snippet.channelTitle,
    cover: {
      small: item.snippet.thumbnails.default.url,
      medium: item.snippet.thumbnails.high.url,
      big: item.snippet.thumbnails.maxres.url,
    },
  }));
};
