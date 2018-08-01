import {YoutubeThumbnails} from './YoutubeThumbnails';
import {YoutubeTracks} from './YoutubeTracks';

export type Track = {
  id: YoutubeTracks['items'][0]['id'];
  name: YoutubeTracks['items'][0]['snippet']['title'];
  channel: YoutubeTracks['items'][0]['snippet']['channelTitle'];
  cover: YoutubeThumbnails['default']['url'];
};
