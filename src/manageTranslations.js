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

const defaultJSONOptions = {
  space: 2,
  trailingNewline: false
};

export default ({
  messagesDirectory,
  translationsDirectory,
  whitelistsDirectory = translationsDirectory,
  languages = [],
  singleMessagesFile = false,
  detectDuplicateIds = true,
  sortKeys = true,
  jsonOptions = {},
  overridePrinters = {},
  overrideCoreMethods = {}
}) => {
  if (!messagesDirectory || !translationsDirectory) {
    throw new Error('messagesDirectory and translationsDirectory are required');
  }

  const defaultPrinters = {
    printDuplicateIds: duplicateIds => {
      header('Duplicate ids:');
      if (duplicateIds.length) {
        duplicateIds.forEach(id => {
          console.log('  ', `Duplicate message id: ${red(id)}`);
        });
      } else {
        console.log(green('  No duplicate ids found, great!'));
      }
      footer();
    },

    printLanguageReport: langResults => {
      header(`Maintaining ${yellow(langResults.languageFilename)}:`);
      printResults({ ...langResults.report, sortKeys });
    },

    printNoLanguageFile: langResults => {
      subheader(`
        No existing ${langResults.languageFilename} translation file found.
        A new one is created.
      `);
    },

    printNoLanguageWhitelistFile: langResults => {
      subheader(
        ```
        No existing ${langResults} file found.
        A new one is created.
      ```
      );
    }
  };

  const printers = {
    ...defaultPrinters,
    ...overridePrinters
  };

  const stringifyOpts = {
    ...defaultJSONOptions,
    ...jsonOptions,
    sortKeys
  };

  const defaultCoreMethods = {
    provideExtractedMessages: () => readMessageFiles(messagesDirectory),

    outputSingleFile: combinedFiles => {
      if (singleMessagesFile) {
        createSingleMessagesFile({
          messages: combinedFiles,
          directory: translationsDirectory,
          sortKeys
        });
      }
    },

    outputDuplicateKeys: duplicateIds => {
      if (!detectDuplicateIds) return;

      printers.printDuplicateIds(duplicateIds);
    },

    beforeReporting: () => {
      mkdirpSync(translationsDirectory);
      mkdirpSync(whitelistsDirectory);
    },

    provideLangTemplate: lang => {
      const languageFilename = `${lang}.json`;
      const languageFilepath = Path.join(
        translationsDirectory,
        languageFilename
      );
      const whitelistFilename = `whitelist_${lang}.json`;
      const whitelistFilepath = Path.join(
        whitelistsDirectory,
        whitelistFilename
      );

      return {
        lang,
        languageFilename,
        languageFilepath,
        whitelistFilename,
        whitelistFilepath
      };
    },

    provideTranslationsFile: langResults => {
      const jsonFile = readFile(langResults.languageFilepath);
      return jsonFile ? JSON.parse(jsonFile) : undefined;
    },

    provideWhitelistFile: langResults => {
      const jsonFile = readFile(langResults.whitelistFilepath);
      return jsonFile ? JSON.parse(jsonFile) : undefined;
    },

    reportLanguage: langResults => {
      if (
        !langResults.report.noTranslationFile &&
        !langResults.report.noWhitelistFile
      ) {
        printers.printLanguageReport(langResults);

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
          printers.printNoLanguageFile(langResults);
          writeFileSync(
            langResults,
            stringify(langResults.report.fileOutput, stringifyOpts)
          );
        }

        if (langResults.report.noWhitelistFile) {
          printers.printNoLanguageWhitelistFile(langResults);
          writeFileSync(
            langResults.whitelistFilepath,
            stringify([], stringifyOpts)
          );
        }
      }
    },

    afterReporting: () => {}
  };

  core(languages, {
    ...defaultCoreMethods,
    ...overrideCoreMethods
  });
};
