import {call, put} from 'redux-saga/effects'
import {performStreamedGet} from "../APISagas";
import {createReceivedHistoryEvent} from "../../events/HistoryEvents";

export function* archiveFetchSaga({payload: {information: {guid}}}) {
  try {
    const data = yield call(performStreamedGet, `/api/history/${guid}/feed`);
    yield put(createReceivedHistoryEvent(data))
  } catch (e) {
    //todo: handle unable to get history
    console.log('shit broked', e);
  }
}

export function* historyObservationSaga() {
  //todo: update history  when viewed again?
  yield call(console.log, 'Viewed history again');
}