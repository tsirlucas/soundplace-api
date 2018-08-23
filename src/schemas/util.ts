import {YoutubeThumbnails} from 'src/models/YoutubeThumbnails';

export const getBig = (thumbnails: YoutubeThumbnails) => thumbnails.maxres || thumbnails.standard || thumbnails.high || thumbnails.medium || thumbnails.default;
export const getSmall = (thumbnails: YoutubeThumbnails) =>  thumbnails.default || thumbnails.medium || thumbnails.high || thumbnails.standard || thumbnails.maxres;
export const getMedium = (thumbnails: YoutubeThumbnails) => thumbnails.medium || thumbnails.high || thumbnails.standard || thumbnails.maxres || thumbnails.default;
