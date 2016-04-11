# React-intl-translations-manager
[![travis-ci][travis-image]][travis-url]
[![Codecov][codecov-image]][codecov-url]
[![Commitizen friendly][comitizen-image]][comitizen-url]
[![semantic-release][semantic-image]][semantic-url]
[![npm-downloads][npm-downloads-image]][npm-downloads-url]
[![npm-version][npm-version-image]][npm-version-url]
[![npm-license][npm-license-image]][npm-license-url]

[travis-image]: https://img.shields.io/travis/GertjanReynaert/react-intl-translations-manager.svg
[travis-url]: https://travis-ci.org/GertjanReynaert/react-intl-translations-manager
[codecov-image]: https://img.shields.io/codecov/c/github/GertjanReynaert/react-intl-translations-manager.svg
[codecov-url]: https://codecov.io/github/GertjanReynaert/react-intl-translations-manager
[comitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[comitizen-url]: http://commitizen.github.io/cz-cli
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[npm-downloads-image]: https://img.shields.io/npm/dt/react-intl-translations-manager.svg
[npm-downloads-url]: https://www.npmjs.com/package/react-intl-translations-manager
[npm-version-image]: https://img.shields.io/npm/v/react-intl-translations-manager.svg
[npm-version-url]: https://www.npmjs.com/package/react-intl-translations-manager
[npm-license-image]: https://img.shields.io/npm/l/react-intl-translations-manager.svg
[npm-license-url]: https://www.npmjs.com/package/react-intl-translations-manager

## Installing

```
npm install --save-dev react-intl-translations-manager
```

## Usage
### Basic

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
import manageTranslations from 'react-intl-translations-manager';

manageTranslations({
  messagesDirectory: 'src/translations/extractedMessages',
  translationsDirectory: 'src/translations/locales/',
  languages: ['nl'], // any language you need
});
```

Run the translation manager with your new npm script

```
npm run manage:translations
```

### Advanced

Build your own translationManager based on the core of this package, or it's
exposed helper methods.

## API

### manageTranslations

This will maintain all translation files. Based on your config you will get output for duplicate ids, and per specified language you will get the deleted translations, added messages (new messages that need to be translated), and not yet translated messages. It will also maintain a whitelist file per language where you can specify translation keys where the translation is identical to the default message. This way you can avoid untranslated message warnings for these messages.

You can optionally pass a printer object to this method. This way you can override the console logging with your own logging logic. If you want custom file writing logic, it is advised to roll your own translationManager based on the core.

#### Config

- `messagesDirectory` (required),
  - Directory where the babel plugin puts the extracted messages. This path is
  relative to your projects root.
  - example: `src/locales/extractedMessages`
- `translationsDirectory` (required),
  - Directory of the translation files the translation manager needs to maintain.
  - example: `src/locales/lang`
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
- `singleMessagesFile` (optional, default: `false`)
  - Option to output a single JSON file containing the aggregate of all extracted messages,
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
- `detectDuplicateIds` (optional, default: `true`)
  - If you want the translationManager to log duplicate message ids or not
- `sortKeys` (optional, default: `true`)
  - If you want the translationManager to sort it's output, both json and console output
- `printers` (optional, default: {})
  - Here you can specify custom logging methods. If not specified a default printer is used.
  - Possible printers to configure:
  ```js
    const printers = {
      printDuplicateIds: ( duplicateIds ) => { console.log(`You have ${duplicateIds.length } duplicate IDs`) },
      printLanguageReport: ( report ) => { console.log('Log report for a language') },
      printNoLanguageFile: ( lang ) => { console.log(`No existing ${lang} translation file found. A new one is created.`) },
      printNoLanguageWhitelistFile: ( lang ) => { console.log(`No existing ${lang} file found. A new one is created.`) },
    };
  ```

### core
```js
core(languages, hooks);
```

This is the core of the translationManager. It just takes a list of languages
and an object with all kinds of hooks it will execute when running. Below you
can find all hooks.

```js
const hooks = {
  provideExtractedMessages,
  outputSingleFile,
  outputDuplicateKeys,
  beforeReporting,
  provideLangTemplate,
  provideTranslationsFile,
  provideWhitelistFile,
  reportLanguage,
  afterReporting,
};
```

#### provideExtractedMessages
```js
const extractedMessages = provideExtractedMessages();
```

Here you should return all extracted messages. This should be an array, with an object per file. Each object should at least contain a `descriptors` key which in turn has an array of message objects. Each message object should at least contain the id and message.
Example:
```js
// Minimal expected return value
const extractedMessages = [
  {
    descriptors: [
      {
        id: 'foo_ok',
        defaultMessage: 'OK',
      },
    ],
  },
];
```

#### outputSingleFile
```js
outputSingleFile(extractedMessages);
```

This gives you the option to output the extractedMessages. This way you can for example shrink all extracted files into a single File containing all messages.

#### outputDuplicateKeys
```js
outputDuplicateKeys(duplicateIds);
```

This gives you the option to warn for duplicate ids.

#### beforeReporting
```js
beforeReporting();
```

Here you can do the preparation of the reporting, like creating the necessary folders, or printing a start message

#### provideLangTemplate
```js
const languageResults = provideLangTemplate(lang);
```

Here you should provide the template for the language results. This is just a basic object (`{}`) which can contain pre-filled in data, potentially based on the language.
The following keys are restricted and will be overridden by the core: `report`, `noTranslationFile` and `noWhitelistFile`.

#### provideTranslationsFile
```js
const translationsFile = provideTranslationsFile(lang);
```

Here you should return the translations for the specified language. This must be an object with the message id and message in a key value format.
```js
const translationsFile = {
  messageId: 'message',
};
```

#### provideWhitelistFile
```js
const whitelistFile = provideWhitelistFile(lang);
```

Here you should return the whitelisted messsage ids for the specified language. This must be an array of strings.
```js
const whitelistFile = [
  'messageId',
];
```

#### reportLanguage
```js
reportLanguage(languageResults)
```

Here you can handle the reporting of the results for a language, like logging and creating files based on the results.

#### afterReporting
```js
afterReporting()
```

Here you can do actions after all reports are made, like cleanup or printing a finished message.

### readMessageFiles
```js
const extractedMessages = readMessageFiles(messagesDirectory);
```

This is a `babel-plugin-react-intl` specific helper method. It will read all extracted JSON file for the specified directory, filter out all files without any messages, and output an array with all messages.

Example output:
```js
const extractedMessages = [
  {
    path: 'src/components/Foo.json',
    descriptors: [
      {
        id: 'foo_ok',
        description: 'Ok text',
        defaultMessage: 'OK',
      },
    ],
  },
];
```

### createSingleMessagesFile
```js
createSingleMessagesFile({ messages, directory });
```

This helper method will output all messages (potentially read by `readMessageFiles`) in a single jsonFile.

- messages: (required)
- directory: (required, string) contains the path to the directory where the file should be written into.
- fileName: (optional, default: `defaultMessages.json`) this filename should contain the `.json` extension
- jsonSpaceIndentation: (optional, default: `2`) number of spaces used for indentation (0-10)

### getDefaultMessages
```js
const messages = getDefaultMessages(extractedMessages);
```

This helper method will flatten all files (as returned from `readMessageFiles`) into a single object.

```js
const messages = {
  messages: {
    messageId: 'message',
  },
  duplicateIds: [
    // potentially double used message keys,
  ]
};
```
