import {YoutubePlaylists} from './YoutubePlaylists';

export type Playlist = {
  id: YoutubePlaylists['items'][0]['id'];
  name: YoutubePlaylists['items'][0]['snippet']['title'];
  cover: {
    small: string;
    medium: string;
    big: string;
  };
};
