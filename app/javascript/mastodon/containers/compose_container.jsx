import { Provider } from 'react-redux';

import { fetchCustomEmojis } from 'tucano/actions/custom_emojis';
import { hydrateStore } from 'tucano/actions/store';
import { Router } from 'tucano/components/router';
import Compose from 'tucano/features/standalone/compose';
import initialState from 'tucano/initial_state';
import { IntlProvider } from 'tucano/locales';
import { store } from 'tucano/store';

if (initialState) {
  store.dispatch(hydrateStore(initialState));
}

store.dispatch(fetchCustomEmojis());

const ComposeContainer = () => (
  <IntlProvider>
    <Provider store={store}>
      <Router>
        <Compose />
      </Router>
    </Provider>
  </IntlProvider>
);

export default ComposeContainer;
