import {SpotifyAuthController} from 'controllers';
import {Router} from 'express';

export const authRouter = Router();

authRouter.get('/spotify', SpotifyAuthController.getInstance().getAuthorizationUrl);

authRouter.get('/spotify/token', SpotifyAuthController.getInstance().getTokenizedUrl);
