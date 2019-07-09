import sagaHelper from "redux-saga-testing";
import {call, select,  put} from 'redux-saga/effects'
import {objectiveHistoryFetchSaga, OBJECTIVES_URL} from "../../../sagas/strategy/ObjectiveSagas";
import {performPost, performPut, performStreamedGet} from "../../../sagas/APISagas";
import {
  createCachedObjectiveEvent,
  createFetchedObjectivesEvent,
  createSyncedObjectiveEvent
} from "../../../events/StrategyEvents";
import {
  cacheObjectiveSaga,
  objectiveAPIInteractionSaga, objectiveChangesSaga,
  objectiveCreateSaga,
  objectiveCreationSaga, objectiveUpdateSaga, objectiveUpdateToCached, objectiveUploadSaga,
  objectiveUploadToCached
} from "../../../sagas/strategy/ObjectiveCreationSagas";
import {isOnline} from "../../../sagas/NetworkSagas";
import {CREATED, UPDATED} from "../../../events/ActivityEvents";
import {selectUserState} from "../../../reducers";
import type {UserState} from "../../../reducers/UserReducer";

describe('Objective Creation Sagas', () => {
  describe('objectiveCreationSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(objectiveCreationSaga({
        payload: 'dis is an objective',
      }));
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(objectiveAPIInteractionSaga,
            'dis is an objective',
            objectiveCreateSaga,
            objectiveUploadToCached));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('objectiveChangesSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(objectiveChangesSaga({
        payload: 'dis is an objective',
      }));
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(objectiveAPIInteractionSaga,
            'dis is an objective',
            objectiveUpdateSaga,
            objectiveUpdateToCached));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('objectiveCreateSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(objectiveCreateSaga('best objective'));
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(objectiveUploadSaga,
            'best objective',
            performPost, objectiveUploadToCached));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('objectiveUpdateSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(objectiveUpdateSaga('best objective'));
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(objectiveUploadSaga,
            'best objective',
            performPut,
            objectiveUpdateToCached));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('objectiveAPIInteractionSaga', () => {
    describe('when online', () => {
      const it = sagaHelper(objectiveAPIInteractionSaga('best objective',
        objectiveUpdateSaga,
        objectiveUpdateToCached));
      it('should ask for online status', sagaEffect => {
        expect(sagaEffect).toEqual(call(isOnline));
        return true;
      });
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(objectiveCreateSaga, 'best objective'));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when offline, and updating objective', () => {
      const it = sagaHelper(objectiveAPIInteractionSaga('best objective',
        objectiveUpdateSaga,
        objectiveUpdateToCached));
      it('should ask for online status', sagaEffect => {
        expect(sagaEffect).toEqual(call(isOnline));
        return false;
      });
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(cacheObjectiveSaga, {
            objective: 'best objective',
            uploadType: UPDATED,
          }));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when offline, and creating objective', () => {
      const it = sagaHelper(objectiveAPIInteractionSaga('best objective',
        objectiveUpdateSaga,
        objectiveUploadToCached));
      it('should ask for online status', sagaEffect => {
        expect(sagaEffect).toEqual(call(isOnline));
        return false;
      });
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(cacheObjectiveSaga, {
            objective: 'best objective',
            uploadType: CREATED,
          }));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('objectiveUploadSaga', () => {
    describe('when online', () => {
      const it = sagaHelper(objectiveUploadSaga('best objective',
        performPut));
      it('should ask for online status', sagaEffect => {
        expect(sagaEffect).toEqual(call(performPut, OBJECTIVES_URL, 'best objective'));
        return 'did objective thing';
      });
      it('should dispetch correct event', sagaEffect => {
        expect(sagaEffect).toEqual(
          put(createSyncedObjectiveEvent('best objective')));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
    describe('when offline', () => {
      const it = sagaHelper(objectiveUploadSaga('best objective',
        performPut, objectiveUpdateToCached));
      it('should ask for online status', sagaEffect => {
        expect(sagaEffect).toEqual(call(performPut, OBJECTIVES_URL, 'best objective'));
        return new Error('Bruh, this aint gunna work');
      });
      it('should try to get objectives', sagaEffect => {
        expect(sagaEffect).toEqual(
          call(cacheObjectiveSaga, {
            objective: 'best objective',
            uploadType: UPDATED,
          }));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
  describe('cacheObjectiveSaga', () => {
    describe('when called', () => {
      const it = sagaHelper(cacheObjectiveSaga('best objective'));
      it('should ask for user state', sagaEffect => {
        expect(sagaEffect).toEqual(select(selectUserState));
        const userState: UserState = {
          information: {
            guid: 'potato'
          }
        };
        return userState;
      });
      it('should dispetch correct event', sagaEffect => {
        expect(sagaEffect).toEqual(
          put(createCachedObjectiveEvent({
            userGUID: 'potato',
            objective: 'best objective',
          })));
      });
      it('should complete', sagaEffect => {
        expect(sagaEffect).toBeUndefined();
      });
    });
  });
});
