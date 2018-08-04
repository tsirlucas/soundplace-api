import {YoutubePageInfo} from './YoutubePageInfo';
import {YoutubeThumbnails} from './YoutubeThumbnails';

type ResourceId = {
  kind: string;
  videoId: string;
};

type Snippet = {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeThumbnails;
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: ResourceId;
};

type Item = {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
};

export type YoutubeTracks = {
  kind: string;
  etag: string;
  pageInfo: YoutubePageInfo;
  items: Item[];
};
