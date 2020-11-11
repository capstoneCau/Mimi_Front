import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ReduxThunk from 'redux-thunk';

const persistConfig = {
  key: 'kakaoId',
  storage: storage,
  whitelist: ['kakaoId'],
};

const enhancedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
  const store = createStore(enhancedReducer, applyMiddleware(ReduxThunk));
  const persistor = persistStore(store);
  return {store, persistor};
}
