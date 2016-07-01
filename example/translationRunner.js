import translationManager from '../dist/index';

translationManager({
  messagesDirectory: './src/locales/extractedMessages',
  translationsDirectory: './src/locales/lang/',
  whitelistsDirectory: './src/locales/whitelists/',
  languages: ['en', 'nl'],
  singleMessagesFile: true,
  defaultLanguage: 'en',
});
