export type SpotifyTracks = {
  href: string;
  items: {
    track: {
      album: {
        id: string;
        images: {
          height: number;
          url: string;
          width: number;
        }[];
        name: string;
      };
      artists: {
        id: string;
        name: string;
      }[];
      id: string;
      name: string;
      duration_ms: number;
    };
  }[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};
