import { writeFileSync } from 'fs';
import { sync as mkdirpSync } from 'mkdirp';
import Path from 'path';
import { yellow, red } from 'chalk';

import readFile from '~/src/readFile';
import { header, subheader, footer } from '~/src/printer';
import readMessageFiles from '~/src/readMessageFiles';
import createSingleMessagesFile from '~/src/createSingleMessagesFile';
import printResults from '~/src/printResults';

import core from '~/src/core';

export default ({
  messagesDirectory,
  translationsDirectory,
  whitelistsDirectory = translationsDirectory,
  languages = [],
  singleMessagesFile = false,
  detectDuplicateIds = true,
  printers = {},
}) => {
  if (!messagesDirectory || !translationsDirectory) {
    throw new Error('messagesDirectory and translationsDirectory are required');
  }

  core(languages, {
    provideExtractedMessages: () => readMessageFiles(messagesDirectory),
    outputSingleFile: combinedFiles => {
      if (singleMessagesFile) {
        createSingleMessagesFile({
          messages: combinedFiles,
          directory: translationsDirectory,
        });
      }
    },
    outputDuplicateKeys: duplicateIds => {
      if (detectDuplicateIds) {
        if (typeof printers.printDuplicateIds === 'function') {
          printers.printDuplicateIds(duplicateIds);
        } else {
          header('Detecting duplicate ids:');
          duplicateIds.forEach(id => {
            console.log('  ', `Duplicate message id: ${red(id)}`);
          });
          footer();
        }
      }
    },
    beforeReporting: () => {
      mkdirpSync(Path.join('./', translationsDirectory));
      mkdirpSync(Path.join('./', whitelistsDirectory));
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
          printResults(langResults.report);
        }

        writeFileSync(
          langResults.languageFilepath,
          JSON.stringify(langResults.report.fileOutput, null, 2)
        );
        writeFileSync(
          langResults.whitelistFilepath,
          JSON.stringify(langResults.report.whitelistOutput, null, 2)
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
          writeFileSync(langResults, JSON.stringify(langResults.report.fileOutput, null, 2));
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
          writeFileSync(langResults.whitelistFilepath, JSON.stringify([], null, 2));
        }
      }
    },
  });
};
