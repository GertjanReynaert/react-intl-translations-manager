import translationManager from '../dist/index';

translationManager({
  messagesDirectory: './src/locales/extractedMessages',
  translationsDirectory: './src/locales/lang/',
  whitelistsDirectory: './src/locales/whitelists/',
  languages: ['nl'],
  singleMessagesFile: true,
});
