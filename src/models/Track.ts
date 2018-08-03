import {YoutubeTracks} from './YoutubeTracks';

export type Track = {
  id: YoutubeTracks['items'][0]['id'];
  name: YoutubeTracks['items'][0]['snippet']['title'];
  channel: YoutubeTracks['items'][0]['snippet']['channelTitle'];
  cover: {
    small: string;
    medium: string;
    big: string;
  };
};
