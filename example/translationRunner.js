import manageTranslations from '../dist/index';

manageTranslations({
  messagesDirectory: './src/locales/extractedMessages',
  translationsDirectory: './src/locales/lang/',
  whitelistsDirectory: './src/locales/whitelists/',
  languages: ['nl'],
  singleMessagesFile: true
});
