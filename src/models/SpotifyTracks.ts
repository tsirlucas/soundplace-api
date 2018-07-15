export type SpotifyTracks = {
  href: string;
  items: {
    added_at: string;
    added_by: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      type: string;
      uri: string;
    };
    is_local: boolean;
    primary_color: string;
    track: {
      album: {
        album_type: string;
        artists: [
          {
            external_urls: {
              spotify: string;
            };
            href: string;
            id: string;
            name: string;
            type: string;
            uri: string;
          }
        ];
        available_markets: string[];
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        images: {
          height: number;
          url: string;
          width: number;
        }[];
        name: string;
        release_date: string;
        release_date_precision: string;
        type: string;
        uri: string;
      };
      artists: {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }[];
      available_markets: string[];
      disc_number: number;
      duration_ms: number;
      episode: boolean;
      explicit: boolean;
      external_ids: {
        isrc: string;
      };
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      is_local: boolean;
      name: string;
      popularity: number;
      preview_url: string;
      track: boolean;
      track_number: number;
      type: string;
      uri: string;
    };
    video_thumbnail: {
      url: string;
    };
  }[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};
