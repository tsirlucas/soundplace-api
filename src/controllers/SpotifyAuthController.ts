import {Request, Response} from 'express';

import {SpotifyAuthService} from 'services';

export class SpotifyAuthController {
  private static instance: SpotifyAuthController;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyAuthController();
    }

    return this.instance;
  }

  public async getAuthorizationUrl(_req: Request, res: Response) {
    res.redirect(await SpotifyAuthService.getInstance().getAuthorizationUrl());
  }

  public async getTokenizedUrl({query}: Request, res: Response) {
    res.redirect(await SpotifyAuthService.getInstance().getTokenizedUrl(query.code));
  }
}
