import { createContainer } from '../../../apps/utils/container';
import { authorizationModule } from '../../../modules/authorization';
import { routeModule } from '../../../modules/route';

const container = createContainer({lazyInject: true, devMode: false});
container.load(authorizationModule);
container.load(routeModule);

import * as React from 'react';
import { IntlProvider } from 'react-intl';
import * as renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider as ApolloProvider } from 'react-apollo/test-utils';
import { Provider as StoreProvider, Store } from 'react-redux';
import { AppWitHOCs as App, OwnProps } from './app';
import { userQuery } from './graphql';
import { translations } from '../../../i18n';
import { createStore, RootState } from '../../../state';
import { PATH_APP } from '../../../constants';

window.requestAnimationFrame = () => {
  throw new Error('requestAnimationFrame is not supported in Node');
};

describe('App', () => {
  let store: Store<RootState>;
  let apolloMocks: { request: { query: string }, result: object }[];
  let currentPath: string;
  let i18nMessages: { [key: string]: string };

  beforeEach(() => {
    store = createStore(
      {
        runtime: {
          variables: {
            appOrigin: 'appOrigin',
            serverOrigin: 'serverOrigin'
          }
        }
      },
      {
        platform: 'browser',
        devMode: true
      }
    );

    apolloMocks = [
      {request: {query: userQuery}, result: {data: {user: null}}}
    ];

    currentPath = PATH_APP;

    i18nMessages = translations.en;
  });

  const renderComponent = (props?: OwnProps) => {
    const component = (
      <MemoryRouter initialEntries={[currentPath]}>
        <StoreProvider store={store}>
          <ApolloProvider mocks={apolloMocks}>
            <IntlProvider locale="en" messages={i18nMessages}>
              <App {...props}/>
            </IntlProvider>
          </ApolloProvider>
        </StoreProvider>
      </MemoryRouter>
    );

    return renderer.create(component);
  };

  it('renders without crashing', () => {
    const component = renderComponent();

    expect(component.toJSON()).toMatchSnapshot();
  });
});
