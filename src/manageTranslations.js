import { writeFileSync } from 'fs';
import { sync as mkdirpSync } from 'mkdirp';
import Path from 'path';
import { yellow, red, green } from 'chalk';

import readFile from './readFile';
import { header, subheader, footer } from './printer';
import readMessageFiles from './readMessageFiles';
import createSingleMessagesFile from './createSingleMessagesFile';
import printResults from './printResults';
import stringify from './stringify';

import core from './core';

export default ({
  messagesDirectory,
  translationsDirectory,
  whitelistsDirectory = translationsDirectory,
  languages = [],
  singleMessagesFile = false,
  detectDuplicateIds = true,
  sortObjectsByKey = false,
  printers = {},
  jsonSpaceIndentation = 2,
}) => {
  if (!messagesDirectory || !translationsDirectory) {
    throw new Error('messagesDirectory and translationsDirectory are required');
  }
  
  var stringifyOpts = {
    space: jsonSpaceIndentation,
    sortKeys: sortObjectsByKey
  };

  core(languages, {
    provideExtractedMessages: () => readMessageFiles(messagesDirectory),
    outputSingleFile: combinedFiles => {
      if (singleMessagesFile) {
        createSingleMessagesFile({
          messages: combinedFiles,
          directory: translationsDirectory,
          sortObjectsByKey
        });
      }
    },
    outputDuplicateKeys: duplicateIds => {
      if (detectDuplicateIds) {
        if (typeof printers.printDuplicateIds === 'function') {
          printers.printDuplicateIds(duplicateIds);
        } else {
          header('Duplicate ids:');
          if (duplicateIds.length) {
            duplicateIds.forEach(id => {
              console.log('  ', `Duplicate message id: ${red(id)}`);
            });
          } else {
            console.log(green('  No duplicate ids found, great!'));
          }
          footer();
        }
      }
    },
    beforeReporting: () => {
      mkdirpSync(translationsDirectory);
      mkdirpSync(whitelistsDirectory);
    },
    provideLangTemplate: lang => {
      const languageFilename = `${lang}.json`;
      const languageFilepath = Path.join(translationsDirectory, languageFilename);
      const whitelistFilename = `whitelist_${lang}.json`;
      const whitelistFilepath = Path.join(whitelistsDirectory, whitelistFilename);

      return {
        lang,
        languageFilename,
        languageFilepath,
        whitelistFilename,
        whitelistFilepath,
      };
    },
    provideTranslationsFile: lang => {
      const filePath = Path.join(translationsDirectory, `${lang}.json`);
      const jsonFile = readFile(filePath);
      return jsonFile ? JSON.parse(jsonFile) : undefined;
    },
    provideWhitelistFile: lang => {
      const filePath = Path.join(whitelistsDirectory, `whitelist_${lang}.json`);
      const jsonFile = readFile(filePath);
      return jsonFile ? JSON.parse(jsonFile) : undefined;
    },
    reportLanguage: langResults => {
      if (!langResults.report.noTranslationFile && !langResults.report.noWhitelistFile) {
        if (typeof printers.printLanguageReport === 'function') {
          printers.printLanguageReport(langResults.languageFilename, langResults.report);
        } else {
          header(`Maintaining ${yellow(langResults.languageFilename)}:`);
          printResults({...langResults.report, sortObjectsByKey});
        }

        writeFileSync(
          langResults.languageFilepath,
          stringify(langResults.report.fileOutput, stringifyOpts)
        );
        writeFileSync(
          langResults.whitelistFilepath,
          stringify(langResults.report.whitelistOutput, stringifyOpts)
        );
      } else {
        if (langResults.report.noTranslationFile) {
          if (typeof printers.printNoLanguageFile === 'function') {
            printers.printNoLanguageFile(langResults.lang);
          } else {
            subheader(```
              No existing ${langResults.languageFilename} translation file found.
              A new one is created.
            ```);
          }
          writeFileSync(langResults, stringify(langResults.report.fileOutput, stringifyOpts));
        }

        if (langResults.report.noWhitelistFile) {
          if (typeof printers.printNoLanguageWhitelistFile === 'function') {
            printers.printNoLanguageWhitelistFile(langResults.lang);
          } else {
            subheader(```
              No existing ${langResults.whitelistFilename} file found.
              A new one is created.
            ```);
          }
          writeFileSync(langResults.whitelistFilepath, stringify([], stringifyOpts));
        }
      }
    },
  });
};
