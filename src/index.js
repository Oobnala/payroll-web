import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import factory from './redux/store';
import './styles/main.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';

const { store, persistor } = factory();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <App />
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
