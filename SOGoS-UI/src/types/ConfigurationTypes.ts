export interface OAuthConfig {
  authorizationEndpoint: string;
  endSessionEndpoint: string;
  revocationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
}

export interface InitialConfig {
  clientID: string;
  appClientId: string;
  authorizationEndpoint: string;
  logoutEndpoint: string;
  userInfoEndpoint: string;
  tokenEndpoint: string;
  openIDConnectURI: string;
  provider: string;
  callbackURI?: string;
  apiURL?: string;
  stagingURL?: string;
}

export interface MiscellaneousConfig {
  notificationsAllowed: string;
}

export const NOT_ASKED = 'NOT_ASKED';
