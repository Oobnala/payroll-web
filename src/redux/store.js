import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import thunk from 'redux-thunk';
import reducers from './reducers';

const persistConfig = {
  key: 'root',
  storage,
};

const composeEnhancers = composeWithDevTools || compose;

const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {
  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
  );

  const persistor = persistStore(store);

  return { store, persistor };
};
