import {all, takeEvery, put } from 'redux-saga/effects'
import {INITIALIZED_SECURITY} from "../events/SecurityActions";
import {performGet} from "./APISagas";
import {receivedUser} from "../events/UserActions";

function* findUserSaga() {
  const {data: user} = yield performGet('./api/user');
  yield put(receivedUser(user)); // found waldo.
}

function* listenToSecurityEvents() {
  yield takeEvery(INITIALIZED_SECURITY, findUserSaga)
}

export default function* rootSaga() {
  yield all([
    listenToSecurityEvents(),
  ])
}