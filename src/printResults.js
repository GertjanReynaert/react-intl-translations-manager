import { green, yellow, red, cyan } from 'chalk';

import { newLine, subheader } from './printer';

function sortByKey(a, b) {
  var ka = a.key, kb = b.key;
  return ka < kb ? -1 : ka > kb ? 1 : 0;
}

export default ({
  deleted,
  untranslated,
  added,
}) => {
  if (!(deleted.length || added.length || untranslated.length)) {
    console.log(green('  Perfectly maintained, no remarks!'));
    newLine();
  } else {
    if (deleted.length) {
      subheader('Deleted keys:');
      deleted.sort(sortByKey).forEach(({ key, message }) => console.log(`  ${red(key)}: ${cyan(message)}`));
      newLine();
    }

    if (untranslated.length) {
      subheader('Untranslated keys:');
      untranslated.sort(sortByKey).forEach(({ key, message }) => console.log(`  ${yellow(key)}: ${cyan(message)}`));
      newLine();
    }

    if (added.length) {
      subheader('Added keys:');
      added.sort(sortByKey).forEach(({ key, message }) => console.log(`  ${green(key)}: ${cyan(message)}`));
      newLine();
    }
  }
};
