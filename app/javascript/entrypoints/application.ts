import './public-path';
import main from 'tucano/main';

import { start } from '../tucano/common';
import { loadLocale } from '../tucano/locales';
import { loadPolyfills } from '../tucano/polyfills';

start();

loadPolyfills()
  .then(loadLocale)
  .then(main)
  .catch((e: unknown) => {
    console.error(e);
  });
