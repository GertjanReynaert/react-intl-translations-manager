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
    defaultLanguage
  } = hooks;

  const processLang = (lang, changedDefaultMessages, isDefaultLang = false) => {
    const langResults = provideLangTemplate(lang);
  
    const file = provideTranslationsFile(langResults);
    const whitelistFile = provideWhitelistFile(langResults);
  
    if (!file) langResults.noTranslationFile = true;
    if (!whitelistFile) langResults.noWhitelistFile = true;
  
    langResults.report = getLanguageReport(
      defaultMessages.messages,
      file,
      whitelistFile,
      changedDefaultMessages,
      isDefaultLang
    );
  
    if (typeof reportLanguage === 'function') reportLanguage(langResults);
    return langResults.report;
  }

  const extractedMessages = provideExtractedMessages();

  if (typeof outputSingleFile === 'function') {
    outputSingleFile(extractedMessages);
  }

  const defaultMessages = getDefaultMessages(extractedMessages);

  if (typeof outputDuplicateKeys === 'function') {
    outputDuplicateKeys(defaultMessages.duplicateIds);
  }

  if (typeof beforeReporting === 'function') beforeReporting();

  const defaultLangIndex = languages.indexOf(defaultLanguage);

  let changedDefaultMessages = [];

  if (defaultLangIndex >= 0) {
    languages.splice(defaultLangIndex, 1);
    const results = processLang(defaultLanguage, changedDefaultMessages, true);
    changedDefaultMessages = results.changedDefaultMessages;
  }

  languages.forEach(lang => {
    processLang(lang, changedDefaultMessages)
  });

  if (typeof afterReporting === 'function') afterReporting();
};
