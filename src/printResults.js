import { green, yellow, red, cyan } from 'chalk';

import { newLine, subheader } from './printer';
import compareByKey from './compareByKey';

export default ({
  deleted,
  untranslated,
  added,
  sortObjectsByKey = false,
}) => {console.log("Sort? ", sortObjectsByKey);
  if (!(deleted.length || added.length || untranslated.length)) {
    console.log(green('  Perfectly maintained, no remarks!'));
    newLine();
  } else {
    if (deleted.length) {
      if (sortObjectsByKey)
        deleted = deleted.sort(compareByKey);
      subheader('Deleted keys:');
      deleted.forEach(({ key, message }) => console.log(`  ${red(key)}: ${cyan(message)}`));
      newLine();
    }

    if (untranslated.length) {
      if (sortObjectsByKey)
        untranslated = untranslated.sort(compareByKey);
      subheader('Untranslated keys:');
      untranslated.forEach(({ key, message }) => console.log(`  ${yellow(key)}: ${cyan(message)}`));
      newLine();
    }

    if (added.length) {
      if (sortObjectsByKey)
        added = added.sort(compareByKey);
      subheader('Added keys:');
      added.forEach(({ key, message }) => console.log(`  ${green(key)}: ${cyan(message)}`));
      newLine();
    }
  }
};
