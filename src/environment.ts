require('dotenv').config();

const commonvars = {
  apiUrl: process.env.API_URL,
  clientUrl: process.env.CLIENT_URL,
};

const secrets = {
  spotifyId: process.env.SPOTIFY_ID,
  spotifySecret: process.env.SPOTIFY_SECRET,
};

export const environment = {
  settings: commonvars,
  secrets: secrets,
};
