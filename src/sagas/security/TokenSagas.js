import {
  AuthorizationServiceConfiguration,
  BaseTokenRequestHandler,
  TokenRequest,
  TokenRequestHandler, TokenResponse
} from "@openid/appauth";
import {createTokenFailureEvent, createTokenReceptionEvent} from "../../events/SecurityEvents";
import {call, put} from 'redux-saga/effects'
import type {OAuthConfig} from "../../reducers/ConfigurationReducer";

const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

export const requestToken = (oauthConfig: AuthorizationServiceConfiguration, tokenRequest: TokenRequest): Promise<TokenResponse> =>
  tokenHandler.performTokenRequest(oauthConfig, tokenRequest);//Because Stateful function ._.

export function* fetchTokenSaga(oauthConfig: OAuthConfig, tokenRequest: TokenRequest, responseModifier: (any) => any) {
  try {
    const tokenResponse = yield call(requestToken, oauthConfig, tokenRequest);
    yield put(createTokenReceptionEvent(responseModifier(tokenResponse)));
  } catch (error) {
    yield put(createTokenFailureEvent({
      tokenRequest,
      error: error.message
    }))
  }
}

/**
 * Attempts to fetch token from Authorization Server.
 *
 * And will include the new refresh token as part of state.
 * @param oauthConfig
 * @param tokenRequest
 * @returns
 */
export function* fetchTokenWithRefreshSaga(oauthConfig: OAuthConfig, tokenRequest: TokenRequest) {
  yield call(fetchTokenSaga, oauthConfig, tokenRequest, tokenResponse => tokenResponse);
}

/**
 * Attempts to fetch token from Authorization Server.
 *
 * And will ***NOT*** include the new refresh token as part of state.
 * @param oauthConfig
 * @param tokenRequest
 * @returns
 */
export function* fetchTokenWithoutSessionRefreshSaga(oauthConfig: OAuthConfig, tokenRequest: TokenRequest) {
  yield call(fetchTokenSaga, oauthConfig, tokenRequest, tokenResponse => {
    delete tokenResponse['refreshToken'];
    return tokenResponse;
  });
}
