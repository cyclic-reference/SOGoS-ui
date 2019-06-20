import {applyMiddleware, compose, createStore} from "redux";
import omit from 'lodash/omit';
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import rootSaga from '../sagas';
import {persistReducer, persistStore, createTransform} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const fetchMiddleware = (sagaMiddleware) => {
  const commonMiddleware = [thunk, sagaMiddleware];
  if (process.env.NODE_ENV === 'development') {
    const reactoTron = require('./ReactotronConfiguration').default;
    return compose(applyMiddleware(...commonMiddleware), reactoTron.createEnhancer());
  }
  return applyMiddleware(...commonMiddleware);
};

const blackListTransform = createTransform((inboundState, key)=> {
  if(key === 'security'){
    return omit(inboundState, ['isInitialized'])
  } else {
    return inboundState;
  }
});

export const fetchApplicationConfiguration = () =>{
  const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['security', 'user', 'activity'],
    transforms: [blackListTransform],
  };

  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    persistReducer(persistConfig, rootReducer),
    fetchMiddleware(sagaMiddleware)
  );
  sagaMiddleware.run(rootSaga);

  const persistor = persistStore(store);

  return {
    store,
    persistor
  }
};
