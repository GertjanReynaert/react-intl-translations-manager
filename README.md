# React-intl-translations-manager
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installing

```
npm install --save-dev react-intl-translations-manager
```

## Usage

Since you need the `babel-plugin-react-intl` to extract the messages, I'll assume you're using babel in your project.

This is an example of the most basic usage of this plugin, in the API documentation below you can find more options.

Create a script in your package.json
```json
{
  "scripts": {
    "manage:translations": "babel-node ./translationRunner.js"
  }
}
```
Create a file with your config you can run with the npm script
```js
// translationRunner.js
import { createTranslationManager } from 'react-intl-translations-manager';

const translationManager = createTranslationManager({
  messagesDirectory: 'src/translations/extractedMessages',
  translationsDirectory: 'src/translations/locales/',
  languages: ['nl'], // any language you need
});

translationManager.run();
```

Run the translation manager with your new npm script

```
npm run manage:translations
```

## API

### createTranslationManager

This will create a new translationManager based on the config you gave in. On
itself this won't do anything unless you run any of the commands below.

#### Config

- `messagesDirectory` (required),
  - Directory where the babel plugin puts the extracted messages. This path is
  relative to your projects root.
  - example: `src/locales/extractedMessages`
- `translationsDirectory` (required),
  - Directory of the translation files the translation manager needs to maintain.
  - example: `src/locales/lang`
- `singleMessagesFile` (optional, default: `false`)
  - Option to output a single file containing the aggregate of all extracted messages,
  grouped by the file they were extracted from.
  - example:
  ```json
    [
      {
        "path": "src/components/foo.json",
        "descriptors": [
          {
            "id": "bar",
            "description": "Text for bar",
            "defaultMessage": "Bar",
          }
        ]
      }
    ]
  ```
- `whitelistsDirectory` (optional, default: `translationsDirectory`)
  - Directory of the whitelist files the translation manager needs to maintain.
  These files contain the key of translations that have the exact same text in a specific language as the defaultMessage. Specifying this key will suppress
  `unmaintained translation` warnings.
  - example: `Dashboard` in english is also accepted as a valid translation for
  dutch.
- `languages` (optional, default: `[]`)
  - What languages the translation manager needs to maintain. Specifying no
  languages actually doesn't make sense, but won't break the translationManager
  either.
  - example: for `['nl', 'fr']` the translation manager will maintain a `nl.json`, `fr.json`, `whitelist_nl.json` and a `whitelist_fr.json` file
- `detectDuplicateIds` (optional, default: `true`)
  - If you want the translationManager to detect duplicate message ids or not

### run

This will maintain all translation files. Based on your config you will get output for duplicate ids, and per specified language you will get the deleted translations, added messages (new messages that need to be translated), and not translated messages.
