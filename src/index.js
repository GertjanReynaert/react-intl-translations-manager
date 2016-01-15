export { default as readMessageFiles } from './readMessageFiles';
export { default as createSingleMessagesFile } from './createSingleMessagesFile';
export { default as getDefaultMessages } from './getDefaultMessages';

import run from './run';

export const createTranslationManager = ({
  messagesDirectory,
  translationsDirectory,
  singleMessagesFile = false,
  whitelistsDirectory = translationsDirectory,
  languages = [],
  detectDuplicateIds = true,
}) => {
  if (!messagesDirectory || !translationsDirectory) {
    throw new Error('messagesDirectory and translationsDirectory are required');
  }

  return printers => run({
    messagesDirectory,
    translationsDirectory,
    singleMessagesFile,
    whitelistsDirectory,
    languages,
    detectDuplicateIds,
    printers,
  });
};
