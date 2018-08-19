import {Track, YoutubeTracks} from 'models';

export const normalizeTracks = (tracks: YoutubeTracks): Track[] => {
  return tracks.items.map((item) => {
    const {thumbnails} = item.snippet;
    const big = thumbnails.maxres || thumbnails.standard || thumbnails.high;

    return {
      id: item.snippet.resourceId.videoId,
      name: item.snippet.title,
      channel: item.snippet.channelTitle,
      cover: {
        small: item.snippet.thumbnails.default.url,
        medium: item.snippet.thumbnails.high.url,
        big: big.url,
      },
    };
  });
};
