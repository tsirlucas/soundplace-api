import {User, YoutubeUser} from 'models';

export const normalizeUser = (user: YoutubeUser): User => {
  return {
    id: user.id,
    name: user.name,
    image: user.picture,
  };
};
