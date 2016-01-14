import { writeFileSync } from 'fs';
import { sync as mkdirpSync } from 'mkdirp';
import Path from 'path';
import { yellow, red } from 'chalk';

import readFile from './readFile';
import { header, subheader, footer } from './printer';

import readMessageFiles from './readMessageFiles';
import createSingleMessagesFile from './createSingleMessagesFile';
import getDefaultMessages from './getDefaultMessages';
import printResults from './printResults';
import getLanguageReport from './getLanguageReport';

export default ({
  messagesDirectory,
  translationsDirectory,
  singleMessagesFile,
  whitelistsDirectory,
  languages,
  detectDuplicateIds,
  printDuplicateIds,
}) => {
  const LANG_DIR = Path.join('./', translationsDirectory);
  const WHITELIST_DIR = Path.join('./', whitelistsDirectory);

  // create folders if needed
  mkdirpSync(LANG_DIR);
  mkdirpSync(WHITELIST_DIR);

  const files = readMessageFiles(messagesDirectory);

  if (singleMessagesFile) {
    createSingleMessagesFile({ messages: files, directory: translationsDirectory });
  }

  const defaultMessages = getDefaultMessages(files);

  if (detectDuplicateIds) {
    if (typeof printDuplicateIds === 'function') {
      printDuplicateIds(defaultMessages.duplicateIds);
    } else {
      header('Detecting duplicate ids:');
      defaultMessages.duplicateIds.forEach(id => {
        console.log('  ', `Duplicate message id: ${red(id)}`);
      });
      footer();
    }
  }

  const report = [];

  languages.forEach(lang => {
    const languageFilename = lang + '.json';
    const languageFilepath = LANG_DIR + languageFilename;
    const whitelistFilename = `whitelist_${lang}.json`;
    const whitelistFilepath = WHITELIST_DIR + whitelistFilename;

    const langResults = {
      lang,
      languageFilename,
      languageFilepath,
      whitelistFilename,
      whitelistFilepath,
    };

    const file = readFile(languageFilepath);
    const whitelistFile = readFile(whitelistFilepath);

    if (file) {
      langResults.report = getLanguageReport(
        defaultMessages.messages,
        JSON.parse(file),
        whitelistFile ? JSON.parse(whitelistFile) : [],
      );
    } else {
      langResults.noTranslationFile = true;
    }

    if (!whitelistFile) langResults.noWhitelistFile = true;

    report.push(langResults);
  });

  // write everything away to the filesystem and console
  report.forEach(languageReport => {
    if (!languageReport.report.noTranslationFile && !languageReport.report.noWhitelistFile) {
      header(`Maintaining ${yellow(languageReport.languageFilename)}:`);
      printResults(languageReport.report);

      writeFileSync(
        languageReport.languageFilepath,
        JSON.stringify(languageReport.report.fileOutput, null, 2)
      );
      writeFileSync(
        languageReport.whitelistFilepath,
        JSON.stringify(languageReport.report.whitelistOutput, null, 2)
      );
    } else {
      if (languageReport.report.noTranslationFile) {
        subheader(```
          No existing ${languageReport.languageFilename} translation file found.
          A new one is created.
          ```);
        writeFileSync(languageReport, JSON.stringify(defaultMessages.messages, null, 2));
      }

      if (languageReport.report.noWhitelistFile) {
        subheader(```
          No existing ${languageReport.whitelistFilename} file found.
          A new one is created.
          ```);
        writeFileSync(languageReport.whitelistFilepath, JSON.stringify([], null, 2));
      }
    }
  });
};
