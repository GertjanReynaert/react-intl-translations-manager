import { green, yellow, red, cyan } from 'chalk';

import { newLine, subheader } from './printer';
import compareByKey from './compareByKey';

export default ({ deleted, untranslated, added, sortKeys = true }) => {
  if (!(deleted.length || added.length || untranslated.length)) {
    console.log(green('  Perfectly maintained, no remarks!'));
    newLine();
  } else {
    if (deleted.length) {
      const items = sortKeys ? deleted.sort(compareByKey) : deleted;
      subheader('Deleted keys:');
      items.forEach(({ key, message }) =>
        console.log(`  ${red(key)}: ${cyan(message)}`)
      );
      newLine();
    }

    if (untranslated.length) {
      const items = sortKeys ? untranslated.sort(compareByKey) : untranslated;
      subheader('Untranslated keys:');
      items.forEach(({ key, message }) =>
        console.log(`  ${yellow(key)}: ${cyan(message)}`)
      );
      newLine();
    }

    if (added.length) {
      const items = sortKeys ? added.sort(compareByKey) : added;
      subheader('Added keys:');
      items.forEach(({ key, message }) =>
        console.log(`  ${green(key)}: ${cyan(message)}`)
      );
      newLine();
    }
  }
};
