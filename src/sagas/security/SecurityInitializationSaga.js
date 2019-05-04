import {call, put, select, take} from 'redux-saga/effects'
import {BaseTokenRequestHandler, TokenRequestHandler} from "@openid/appauth";
import {canRefreshToken, needsToLogIn} from "../../security/OAuth";
import {
  createSecurityInitalizedEvent,
  createTokenReceptionEvent,
  LOGGED_ON,
  requestLogon
} from "../../events/SecurityActions";
import {refreshTokenSaga} from "./RefreshTokenSaga";

const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

export function* getNewTokens(oauthConfig, tokenRequest) {
  const tokenResponse = yield call(() => tokenHandler.performTokenRequest(oauthConfig, tokenRequest));
  yield put(createTokenReceptionEvent(tokenResponse));
}

function* oauthInitializationSaga(oauthConfig) {
  const {security} = yield select();
  if (canRefreshToken(security)) {
    yield refreshTokenSaga(oauthConfig, security);
  } else if (needsToLogIn(security)) {
    yield put(requestLogon(oauthConfig)); // ask to be logged in
    yield take(LOGGED_ON); // wait until logged in
  }
  yield put(createSecurityInitalizedEvent());
}

export default oauthInitializationSaga;