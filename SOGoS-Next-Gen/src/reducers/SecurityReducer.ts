import {EXPIRED_SESSION, INITIALIZED_SECURITY, LOGGED_OFF, LOGGED_ON, RECEIVED_TOKENS} from "../events/SecurityEvents";
import {tokenReceptionReducer} from "./security/TokenReducers";
import {Action} from "redux";
import {RECEIVED_USER} from "../events/UserEvents";
import type {TokenInformation} from "../types/SecurityModels";

export type SecurityState = {
  isLoggedIn: boolean,
  accessToken: string,
  accessTokenInformation: TokenInformation,
  refreshToken: string,
  refreshTokenInformation: TokenInformation,
  idToken: string,
  verificationKey: string,
  isExpired: boolean,
  isInitialized: boolean,
};

const INITIAL_SECURITY_STATE: SecurityState = {
  isLoggedIn: false,
  isExpired: false,
  isInitialized: false,
};

const securityReducer = (state = INITIAL_SECURITY_STATE, action: Action) => {
  switch (action.type) {
    case LOGGED_ON :
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGGED_OFF :
      return {
        ...INITIAL_SECURITY_STATE,
      };
    case EXPIRED_SESSION:
      delete state.refreshToken;
      delete state.refreshTokenInformation;
      return {
        ...state,
        isExpired: true,
      };
    case INITIALIZED_SECURITY:
      return {
        ...state,
        isExpired: false,
        isInitialized: true,
      };
    case RECEIVED_TOKENS:
      return tokenReceptionReducer(state, action.payload);
    case RECEIVED_USER:
      return {
        ...state,
        ...action.payload.security,
      };
    default:
      return state
  }
};

export default securityReducer;