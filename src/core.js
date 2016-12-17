export default (languages, hooks) => {
  const {
    provideExtractedMessages,
    outputSingleFile,
    getDefaultMessages,
    outputDuplicateKeys,
    beforeReporting,
    provideLangTemplate,
    provideTranslationsFile,
    provideWhitelistFile,
    getLanguageReport,
    reportLanguage,
    afterReporting,
  } = hooks;

  const extractedMessages = provideExtractedMessages();

  if (typeof outputSingleFile === 'function') outputSingleFile(extractedMessages);

  const defaultMessages = getDefaultMessages(extractedMessages);

  if (typeof outputDuplicateKeys === 'function') outputDuplicateKeys(defaultMessages.duplicateIds);

  if (typeof beforeReporting === 'function') beforeReporting();

  languages.forEach(lang => {
    const langResults = provideLangTemplate(lang);

    const file = provideTranslationsFile(lang);
    const whitelistFile = provideWhitelistFile(lang);

    if (!file) langResults.noTranslationFile = true;
    if (!whitelistFile) langResults.noWhitelistFile = true;

    langResults.report = getLanguageReport(defaultMessages.messages, file, whitelistFile);

    if (typeof reportLanguage === 'function') reportLanguage(langResults);
  });

  if (typeof afterReporting === 'function') afterReporting();
};
