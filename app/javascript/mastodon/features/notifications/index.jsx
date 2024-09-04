import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';

import { createSelector } from '@reduxjs/toolkit';
import { List as ImmutableList } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { debounce } from 'lodash';

import DoneAllIcon from '@/material-icons/400-24px/done_all.svg?react';
import NotificationsIcon from '@/material-icons/400-24px/notifications-fill.svg?react';
import { compareId } from 'tucano/compare_id';
import { Icon }  from 'tucano/components/icon';
import { NotSignedInIndicator } from 'tucano/components/not_signed_in_indicator';
import { identityContextPropShape, withIdentity } from 'tucano/identity_context';

import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import { submitMarkers } from '../../actions/markers';
import {
  expandNotifications,
  scrollTopNotifications,
  loadPending,
  mountNotifications,
  unmountNotifications,
  markNotificationsAsRead,
} from '../../actions/notifications';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import { LoadGap } from '../../components/load_gap';
import ScrollableList from '../../components/scrollable_list';

import {
  FilteredNotificationsBanner,
  FilteredNotificationsIconButton,
} from './components/filtered_notifications_banner';
import NotificationsPermissionBanner from './components/notifications_permission_banner';
import ColumnSettingsContainer from './containers/column_settings_container';
import FilterBarContainer from './containers/filter_bar_container';
import NotificationContainer from './containers/notification_container';

const messages = defineMessages({
  title: { id: 'column.notifications', defaultMessage: 'Notifications' },
  markAsRead : { id: 'notifications.mark_as_read', defaultMessage: 'Mark every notification as read' },
});

const getExcludedTypes = createSelector([
  state => state.getIn(['settings', 'notifications', 'shows']),
], (shows) => {
  return ImmutableList(shows.filter(item => !item).keys());
});

const getNotifications = createSelector([
  state => state.getIn(['settings', 'notifications', 'quickFilter', 'show']),
  state => state.getIn(['settings', 'notifications', 'quickFilter', 'active']),
  getExcludedTypes,
  state => state.getIn(['notifications', 'items']),
], (showFilterBar, allowedType, excludedTypes, notifications) => {
  if (!showFilterBar || allowedType === 'all') {
    // used if user changed the notification settings after loading the notifications from the server
    // otherwise a list of notifications will come pre-filtered from the backend
    // we need to turn it off for FilterBar in order not to block ourselves from seeing a specific category
    return notifications.filterNot(item => item !== null && excludedTypes.includes(item.get('type')));
  }
  return notifications.filter(item => item === null || allowedType === item.get('type'));
});

const mapStateToProps = state => ({
  notifications: getNotifications(state),
  isLoading: state.getIn(['notifications', 'isLoading'], 0) > 0,
  isUnread: state.getIn(['notifications', 'unread']) > 0 || state.getIn(['notifications', 'pendingItems']).size > 0,
  hasMore: state.getIn(['notifications', 'hasMore']),
  numPending: state.getIn(['notifications', 'pendingItems'], ImmutableList()).size,
  lastReadId: state.getIn(['settings', 'notifications', 'showUnread']) ? state.getIn(['notifications', 'readMarkerId']) : '0',
  canMarkAsRead: state.getIn(['settings', 'notifications', 'showUnread']) && state.getIn(['notifications', 'readMarkerId']) !== '0' && getNotifications(state).some(item => item !== null && compareId(item.get('id'), state.getIn(['notifications', 'readMarkerId'])) > 0),
  needsNotificationPermission: state.getIn(['settings', 'notifications', 'alerts']).includes(true) && state.getIn(['notifications', 'browserSupport']) && state.getIn(['notifications', 'browserPermission']) === 'default' && !state.getIn(['settings', 'notifications', 'dismissPermissionBanner']),
});

class Notifications extends PureComponent {
  static propTypes = {
    identity: identityContextPropShape,
    columnId: PropTypes.string,
    notifications: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    isUnread: PropTypes.bool,
    multiColumn: PropTypes.bool,
    hasMore: PropTypes.bool,
    numPending: PropTypes.number,
    lastReadId: PropTypes.string,
    canMarkAsRead: PropTypes.bool,
    needsNotificationPermission: PropTypes.bool,
  };

  static defaultProps = {
    trackScroll: true,
  };

  UNSAFE_componentWillMount() {
    this.props.dispatch(mountNotifications());
  }

  componentWillUnmount () {
    this.handleLoadOlder.cancel();
    this.handleScrollToTop.cancel();
    this.handleScroll.cancel();
    this.props.dispatch(scrollTopNotifications(false));
    this.props.dispatch(unmountNotifications());
  }

  handleLoadGap = (maxId) => {
    this.props.dispatch(expandNotifications({ maxId }));
  };

  handleLoadOlder = debounce(() => {
    const last = this.props.notifications.last();
    this.props.dispatch(expandNotifications({ maxId: last && last.get('id') }));
  }, 300, { leading: true });

  handleLoadPending = () => {
    this.props.dispatch(loadPending());
  };

  handleScrollToTop = debounce(() => {
    this.props.dispatch(scrollTopNotifications(true));
  }, 100);

  handleScroll = debounce(() => {
    this.props.dispatch(scrollTopNotifications(false));
  }, 100);

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('NOTIFICATIONS', {}));
    }
  };

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setColumnRef = c => {
    this.column = c;
  };

  handleMoveUp = id => {
    const elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) - 1;
    this._selectChild(elementIndex, true);
  };

  handleMoveDown = id => {
    const elementIndex = this.props.notifications.findIndex(item => item !== null && item.get('id') === id) + 1;
    this._selectChild(elementIndex, false);
  };

  _selectChild (index, align_top) {
    const container = this.column.node;
    const element = container.querySelector(`article:nth-of-type(${index + 1}) .focusable`);

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true);
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false);
      }
      element.focus();
    }
  }

  handleMarkAsRead = () => {
    this.props.dispatch(markNotificationsAsRead());
    this.props.dispatch(submitMarkers({ immediate: true }));
  };

  render () {
    const { intl, notifications, isLoading, isUnread, columnId, multiColumn, hasMore, numPending, lastReadId, canMarkAsRead, needsNotificationPermission } = this.props;
    const pinned = !!columnId;
    const emptyMessage = <FormattedMessage id='empty_column.notifications' defaultMessage="You don't have any notifications yet. When other people interact with you, you will see it here." />;
    const { signedIn } = this.props.identity;

    let scrollableContent = null;

    const filterBarContainer = signedIn
      ? (<FilterBarContainer />)
      : null;

    if (isLoading && this.scrollableContent) {
      scrollableContent = this.scrollableContent;
    } else if (notifications.size > 0 || hasMore) {
      scrollableContent = notifications.map((item, index) => item === null ? (
        <LoadGap
          key={'gap:' + notifications.getIn([index + 1, 'id'])}
          disabled={isLoading}
          param={index > 0 ? notifications.getIn([index - 1, 'id']) : null}
          onClick={this.handleLoadGap}
        />
      ) : (
        <NotificationContainer
          key={item.get('id')}
          notification={item}
          accountId={item.get('account')}
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
          unread={lastReadId !== '0' && compareId(item.get('id'), lastReadId) > 0}
        />
      ));
    } else {
      scrollableContent = null;
    }

    this.scrollableContent = scrollableContent;

    let scrollContainer;

    const prepend = (
      <>
        {needsNotificationPermission && <NotificationsPermissionBanner />}
        <FilteredNotificationsBanner />
      </>
    );

    if (signedIn) {
      scrollContainer = (
        <ScrollableList
          scrollKey={`notifications-${columnId}`}
          trackScroll={!pinned}
          isLoading={isLoading}
          showLoading={isLoading && notifications.size === 0}
          hasMore={hasMore}
          numPending={numPending}
          prepend={prepend}
          alwaysPrepend
          emptyMessage={emptyMessage}
          onLoadMore={this.handleLoadOlder}
          onLoadPending={this.handleLoadPending}
          onScrollToTop={this.handleScrollToTop}
          onScroll={this.handleScroll}
          bindToDocument={!multiColumn}
        >
          {scrollableContent}
        </ScrollableList>
      );
    } else {
      scrollContainer = <NotSignedInIndicator />;
    }

    const extraButton = (
      <>
        <FilteredNotificationsIconButton className='column-header__button' />
        {canMarkAsRead && (
          <button
            aria-label={intl.formatMessage(messages.markAsRead)}
            title={intl.formatMessage(messages.markAsRead)}
            onClick={this.handleMarkAsRead}
            className='column-header__button'
          >
            <Icon id='done-all' icon={DoneAllIcon} />
          </button>
        )}
      </>
    );

    return (
      <Column bindToDocument={!multiColumn} ref={this.setColumnRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='bell'
          iconComponent={NotificationsIcon}
          active={isUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
          extraButton={extraButton}
        >
          <ColumnSettingsContainer />
        </ColumnHeader>

        {filterBarContainer}

        {scrollContainer}

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(withIdentity(injectIntl(Notifications)));
