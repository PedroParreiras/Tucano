import { createRoot } from 'react-dom/client';

import { setupBrowserNotifications } from 'tucano/actions/notifications';
import tucano from 'tucano/containers/tucano';
import { me } from 'tucano/initial_state';
import * as perf from 'tucano/performance';
import ready from 'tucano/ready';
import { store } from 'tucano/store';

import { isProduction } from './utils/environment';

/**
 * @returns {Promise<void>}
 */
function main() {
  perf.start('main()');

  return ready(async () => {
    const mountNode = document.getElementById('tucano');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    const root = createRoot(mountNode);
    root.render(<tucano {...props} />);
    store.dispatch(setupBrowserNotifications());

    if (isProduction() && me && 'serviceWorker' in navigator) {
      const { Workbox } = await import('workbox-window');
      const wb = new Workbox('/sw.js');
      /** @type {ServiceWorkerRegistration} */
      let registration;

      try {
        registration = await wb.register();
      } catch (err) {
        console.error(err);
      }

      if (registration && 'Notification' in window && Notification.permission === 'granted') {
        const registerPushNotifications = await import('tucano/actions/push_notifications');

        store.dispatch(registerPushNotifications.register());
      }
    }

    perf.stop('main()');
  });
}

export default main;
