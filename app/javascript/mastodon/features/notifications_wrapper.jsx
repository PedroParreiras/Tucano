import Notifications from 'tucano/features/notifications';
import Notifications_v2 from 'tucano/features/notifications_v2';
import { selectUseGroupedNotifications } from 'tucano/selectors/settings';
import { useAppSelector } from 'tucano/store';

export const NotificationsWrapper = (props) => {
  const optedInGroupedNotifications = useAppSelector(selectUseGroupedNotifications);

  return (
    optedInGroupedNotifications ? <Notifications_v2 {...props} /> : <Notifications {...props} />
  );
};

export default NotificationsWrapper;