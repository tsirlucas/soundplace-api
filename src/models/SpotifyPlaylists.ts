export type SpotifyPlaylists = {
  href: string;
  items: {
    id: string;
    images: {
      url: string;
    }[];
    name: string;
  }[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};
