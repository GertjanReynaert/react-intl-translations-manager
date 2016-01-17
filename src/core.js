import getDefaultMessages from './getDefaultMessages';
import getLanguageReport from './getLanguageReport';

export default (languages, hooks) => {
  const {
    provideExtractedMessages,
    outputSingleFile,
    outputDuplicateKeys,
    beforeReporting,
    provideLangTemplate,
    provideTranslationsFile,
    provideWhitelistFile,
    reportLanguage,
    afterReporting,
  } = hooks;

  const extractedMessages = provideExtractedMessages();

  outputSingleFile(extractedMessages);

  const defaultMessages = getDefaultMessages(extractedMessages);

  outputDuplicateKeys(defaultMessages.duplicateIds);

  beforeReporting();

  languages.forEach(lang => {
    const langResults = provideLangTemplate(lang);

    const file = provideTranslationsFile(lang);
    const whitelistFile = provideWhitelistFile(lang);

    if (!file) langResults.noTranslationFile = true;
    if (!whitelistFile) langResults.noWhitelistFile = true;

    langResults.report = getLanguageReport(defaultMessages.messages, file, whitelistFile);

    reportLanguage(langResults);
  });

  afterReporting();
};
