import {Track, YoutubeTracks} from 'models';

export const normalizeTracks = (tracks: YoutubeTracks): Track[] => {
  return tracks.items.map((item) => ({
    id: item.id,
    name: item.snippet.title,
    channel: item.snippet.channelTitle,
    cover: item.snippet.thumbnails.default.url,
  }));
};
