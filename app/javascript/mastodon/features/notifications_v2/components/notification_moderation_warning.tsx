import { ModerationWarning } from 'tucano/features/notifications/components/moderation_warning';
import type { NotificationGroupModerationWarning } from 'tucano/models/notification_group';

export const NotificationModerationWarning: React.FC<{
  notification: NotificationGroupModerationWarning;
  unread: boolean;
}> = ({ notification: { moderationWarning }, unread }) => (
  <ModerationWarning
    action={moderationWarning.action}
    id={moderationWarning.id}
    unread={unread}
  />
);
