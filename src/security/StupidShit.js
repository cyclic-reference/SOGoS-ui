import {
  AuthorizationError,
  AuthorizationRequest,
  AuthorizationResponse,
  BasicQueryStringUtils,
  RedirectRequestHandler
} from "@openid/appauth";

const AUTHORIZATION_REQUEST_HANDLE_KEY = 'appauth_current_authorization_request';

const authorizationServiceConfigurationKey =
  (handle: string) => `${handle}_appauth_authorization_service_configuration`;

const authorizationRequestKey =
  (handle: string) => `${handle}_appauth_authorization_request`;

const queryStringBitch = new BasicQueryStringUtils();

const getResponse = (error, queryParams): AuthorizationResponse =>{
  if(error){
    return null
  } else {
    return new AuthorizationResponse({
      code: queryParams['code'],
      state: queryParams['state']
    })
  }
};

const getError = (error, queryParams): AuthorizationError =>{
  if(error){
    return new AuthorizationError({
      error: error,
      error_description: queryParams['error_description'],
      error_uri: queryParams['error_uri'],
      state: queryParams['state'],
    })
  } else {
    return null;
  }
};

const cleanUpURI = ()=>{
  const uri = window.location.toString();
  const queryParamStart = uri.indexOf("?");
  if(queryParamStart){
    const clean_uri = uri.substring(0, queryParamStart);
    window.history.replaceState({}, document.title, clean_uri);
  }
};

const completeRequest = (storageBackend, handle) =>
  storageBackend.getItem(authorizationRequestKey(handle))
    .then(authorizationRequest => JSON.parse(authorizationRequest))
    .then(authorizationRequest => new AuthorizationRequest(authorizationRequest))
    .then(authorizationRequest => {
      const location = window.location;
      const queryParams = queryStringBitch.parse(location, false);//all that work to change this stupid line......Thanks Obama.
      const error: string|undefined = queryParams['error'];
      const shouldNotify = queryParams['state'] === authorizationRequest.state;
      if(shouldNotify){
        return Promise.all([
          storageBackend.removeItem(AUTHORIZATION_REQUEST_HANDLE_KEY),
          storageBackend.removeItem(authorizationRequestKey(handle)),
          storageBackend.removeItem(authorizationServiceConfigurationKey(handle))
        ]).then(()=>({
          request: authorizationRequest,
          response: getResponse(error, queryParams),
          error: getError(error, queryParams),
        }))
      } else {
        return Promise.resolve(null);
      }
    });

export const completeAuthorizationRequest= (authorizationHandler: RedirectRequestHandler) =>
  authorizationHandler.storageBackend.getItem(AUTHORIZATION_REQUEST_HANDLE_KEY)
    .then(handle => handle ? completeRequest(authorizationHandler.storageBackend, handle): null)
    .then(result =>{
      cleanUpURI();
      return result;
    });
