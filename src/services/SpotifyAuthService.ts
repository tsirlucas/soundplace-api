import axios, {AxiosInstance} from 'axios';
import {environment} from 'config';
import queryString from 'query-string';

export class SpotifyAuthService {
  private static instance: SpotifyAuthService;

  private endpoint = 'https://accounts.spotify.com';
  private scope = 'user-read-private user-read-email user-read-birthdate user-follow-read';
  private redirectUri = `${environment.settings.apiUrl}/data/auth/spotify/token`;
  private clientId = environment.secrets.spotifyId;
  private clientSecret = environment.secrets.spotifySecret;
  private clientUrl = `${environment.settings.clientUrl}/#`;

  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.endpoint,
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SpotifyAuthService();
    }

    return this.instance;
  }

  public getAuthorizationUrl() {
    return (
      `${this.endpoint}/authorize?` +
      queryString.stringify({
        response_type: 'code',
        client_id: this.clientId,
        scope: this.scope,
        redirect_uri: this.redirectUri,
      })
    );
  }

  public async getTokenizedUrl(code: string) {
    try {
      const result = await this.axiosInstance.post('/api/token', null, {
        params: {
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return (
        `${this.clientUrl}/login?` +
        queryString.stringify({
          access_token: result.data.access_token,
          expires_in: result.data.expires_in,
        })
      );
    } catch (e) {
      throw e;
    }
  }
}
