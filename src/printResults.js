import { green, yellow, red, cyan } from 'chalk';

import { newLine, subheader, header } from './printer';

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
      deleted.forEach(({ key, message }) => console.log(`  ${red(key)}: ${cyan(message)}`));
      newLine();
    }

    if (untranslated.length) {
      subheader('Untranslated keys:');
      untranslated.forEach(({ key, message }) => console.log(`  ${yellow(key)}: ${cyan(message)}`));
      newLine();
    }

    if (added.length) {
      subheader('Added keys:');
      added.forEach(({ key, message }) => console.log(`  ${green(key)}: ${cyan(message)}`));
      newLine();
    }
  }
};
