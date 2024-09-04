import './public-path';
import { createRoot } from 'react-dom/client';

import { start } from '../tucano/common';
import ComposeContainer from '../tucano/containers/compose_container';
import { loadPolyfills } from '../tucano/polyfills';
import ready from '../tucano/ready';

start();

function loaded() {
  const mountNode = document.getElementById('tucano-compose');

  if (mountNode) {
    const attr = mountNode.getAttribute('data-props');

    if (!attr) return;

    const props = JSON.parse(attr) as object;
    const root = createRoot(mountNode);

    root.render(<ComposeContainer {...props} />);
  }
}

function main() {
  ready(loaded).catch((error: unknown) => {
    console.error(error);
  });
}

loadPolyfills()
  .then(main)
  .catch((error: unknown) => {
    console.error(error);
  });
