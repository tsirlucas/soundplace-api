import {YoutubePlaylists} from './YoutubePlaylists';
import {YoutubeThumbnails} from './YoutubeThumbnails';

export type Playlist = {
  id: YoutubePlaylists['items'][0]['id'];
  name: YoutubePlaylists['items'][0]['snippet']['title'];
  cover: YoutubeThumbnails['default']['url'];
};
