import getDefaultMessages from './getDefaultMessages';
import getLanguageReport from './getLanguageReport';

export default (languages, hooks) => {
  const {
    provideExtractedMessages,
    outputSingleFile,
    onDuplicateKeys,
    beforeReporting,
    provideLangTemplate,
    provideTranslationsFile,
    provideWhitelistFile,
    reportLanguage,
    afterReporting
  } = hooks;

  const extractedMessages = provideExtractedMessages();
  const errors = [];

  if (typeof outputSingleFile === 'function') {
    outputSingleFile(extractedMessages);
  }

  const defaultMessages = getDefaultMessages(extractedMessages);

  if (typeof onDuplicateKeys === 'function') {
    try {
      onDuplicateKeys(defaultMessages.duplicateIds);
    } catch (e) {
      errors.push(e);
    }
  }

  if (typeof beforeReporting === 'function') beforeReporting();

  languages.forEach(lang => {
    const langResults = provideLangTemplate(lang);

    const file = provideTranslationsFile(langResults);
    const whitelistFile = provideWhitelistFile(langResults);

    if (!file) langResults.noTranslationFile = true;
    if (!whitelistFile) langResults.noWhitelistFile = true;

    langResults.report = getLanguageReport(
      defaultMessages.messages,
      file,
      whitelistFile
    );

    if (typeof reportLanguage === 'function') {
      try {
        reportLanguage(langResults);
      } catch (e) {
        errors.push(e);
      }
    }
  });

  if (typeof afterReporting === 'function') afterReporting(errors);
};
