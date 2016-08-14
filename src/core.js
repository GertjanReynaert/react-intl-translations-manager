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
    defaultLanguage,
    reportDefaultLanguage,
    afterReporting,
  } = hooks;

  const extractedMessages = provideExtractedMessages();

  if (typeof outputSingleFile === 'function') outputSingleFile(extractedMessages);

  const defaultMessages = getDefaultMessages(extractedMessages);

  if (typeof outputDuplicateKeys === 'function') outputDuplicateKeys(defaultMessages.duplicateIds);

  if (typeof beforeReporting === 'function') beforeReporting();

  const filteredLanguages = defaultLanguage
    ? languages.filter(lang => lang !== defaultLanguage)
    : languages;

  filteredLanguages.forEach(lang => {
    const langResults = provideLangTemplate(lang);

    const file = provideTranslationsFile(lang);
    const whitelistFile = provideWhitelistFile(lang);

    if (!file) langResults.noTranslationFile = true;
    if (!whitelistFile) langResults.noWhitelistFile = true;

    langResults.report = getLanguageReport(defaultMessages.messages, file, whitelistFile);

    if (typeof reportLanguage === 'function') reportLanguage(langResults);
  });

  if (typeof defaultLanguage === 'string') {
    const langResults = provideLangTemplate(defaultLanguage);

    const file = provideTranslationsFile(defaultLanguage);

    if (!file) langResults.noTranslationFile = true;

    langResults.report = getLanguageReport(defaultMessages.messages, file);

    if (typeof reportDefaultLanguage === 'function') reportDefaultLanguage(langResults);
  }

  if (typeof afterReporting === 'function') afterReporting();
};
