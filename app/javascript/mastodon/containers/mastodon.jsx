import { PureComponent } from 'react';

import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';

import { Provider as ReduxProvider } from 'react-redux';

import { ScrollContext } from 'react-router-scroll-4';

import { fetchCustomEmojis } from 'tucano/actions/custom_emojis';
import { hydrateStore } from 'tucano/actions/store';
import { connectUserStream } from 'tucano/actions/streaming';
import ErrorBoundary from 'tucano/components/error_boundary';
import { Router } from 'tucano/components/router';
import UI from 'tucano/features/ui';
import { IdentityContext, createIdentityContext } from 'tucano/identity_context';
import initialState, { title as siteTitle } from 'tucano/initial_state';
import { IntlProvider } from 'tucano/locales';
import { store } from 'tucano/store';
import { isProduction } from 'tucano/utils/environment';

const title = isProduction() ? siteTitle : `${siteTitle} (Dev)`;

const hydrateAction = hydrateStore(initialState);

store.dispatch(hydrateAction);
if (initialState.meta.me) {
  store.dispatch(fetchCustomEmojis());
}

export default class tucano extends PureComponent {
  identity = createIdentityContext(initialState);

  componentDidMount() {
    if (this.identity.signedIn) {
      this.disconnect = store.dispatch(connectUserStream());
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  shouldUpdateScroll (prevRouterProps, { location }) {
    return !(location.state?.tucanoModalKey && location.state?.tucanoModalKey !== prevRouterProps?.location?.state?.tucanoModalKey);
  }

  render () {
    return (
      <IdentityContext.Provider value={this.identity}>
        <IntlProvider>
          <ReduxProvider store={store}>
            <ErrorBoundary>
              <Router>
                <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
                  <Route path='/' component={UI} />
                </ScrollContext>
              </Router>

              <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`} />
            </ErrorBoundary>
          </ReduxProvider>
        </IntlProvider>
      </IdentityContext.Provider>
    );
  }

}
