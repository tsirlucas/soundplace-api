import {YoutubePageInfo} from './YoutubePageInfo';
import {YoutubeThumbnails} from './YoutubeThumbnails';

type Localized = {
  title: string;
  description: string;
};

type Snippet = {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeThumbnails;
  channelTitle: string;
  localized: Localized;
};

type Item = {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
};

export type YoutubePlaylists = {
  kind: string;
  etag: string;
  pageInfo: YoutubePageInfo;
  items: Item[];
};
