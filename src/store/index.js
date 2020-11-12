import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../modules/index';
import {persistStore, persistReducer} from 'redux-persist';
//import storage from 'redux-persist/lib/storage';
import ReduxThunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'userInfo',
  storage: AsyncStorage,
  whitelist: ['userInfo'],
};

const enhancedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
  const store = createStore(enhancedReducer, applyMiddleware(ReduxThunk));
  const persistor = persistStore(store);
  return {store, persistor};
}
