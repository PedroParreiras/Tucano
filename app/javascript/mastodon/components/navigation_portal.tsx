import { Switch, Route } from 'react-router-dom';

import AccountNavigation from 'tucano/features/account/navigation';
import Trends from 'tucano/features/getting_started/containers/trends_container';
import { showTrends } from 'tucano/initial_state';

const DefaultNavigation: React.FC = () =>
  showTrends ? (
    <>
      <div className='flex-spacer' />
      <Trends />
    </>
  ) : null;

export const NavigationPortal: React.FC = () => (
  <Switch>
    <Route path='/@:acct' exact component={AccountNavigation} />
    <Route path='/@:acct/tagged/:tagged?' exact component={AccountNavigation} />
    <Route path='/@:acct/with_replies' exact component={AccountNavigation} />
    <Route path='/@:acct/followers' exact component={AccountNavigation} />
    <Route path='/@:acct/following' exact component={AccountNavigation} />
    <Route path='/@:acct/media' exact component={AccountNavigation} />
    <Route component={DefaultNavigation} />
  </Switch>
);
