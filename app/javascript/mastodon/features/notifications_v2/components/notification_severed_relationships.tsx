import { RelationshipsSeveranceEvent } from 'tucano/features/notifications/components/relationships_severance_event';
import type { NotificationGroupSeveredRelationships } from 'tucano/models/notification_group';

export const NotificationSeveredRelationships: React.FC<{
  notification: NotificationGroupSeveredRelationships;
  unread: boolean;
}> = ({ notification: { event }, unread }) => (
  <RelationshipsSeveranceEvent
    type={event.type}
    target={event.target_name}
    followersCount={event.followers_count}
    followingCount={event.following_count}
    unread={unread}
  />
);
