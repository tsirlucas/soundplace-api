import {SpotifyUser, User} from 'models';

export const normalizeUser = (user: SpotifyUser): User => {
  return {
    id: user.id,
    name: user.display_name,
    image: user.images[0].url,
  };
};
