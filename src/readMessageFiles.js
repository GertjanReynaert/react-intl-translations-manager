import { readFileSync } from 'fs';
import { sync as globSync } from 'glob';
import Path from 'path';

export default messagesDirectory => {
  if (
    !messagesDirectory ||
    typeof messagesDirectory !== 'string' ||
    messagesDirectory.length === 0
  ) {
    throw new Error('messagesDirectory is required');
  }

  const EXTRACTED_MESSAGES_DIR = Path.join(messagesDirectory, '/');
  const EXTRACTED_MESSAGES = Path.join(EXTRACTED_MESSAGES_DIR, '**/*.json');

  return globSync(EXTRACTED_MESSAGES)
    .map(filename => ({
      path: filename.substring(EXTRACTED_MESSAGES_DIR.length),
      descriptors: JSON.parse(readFileSync(filename, 'utf8'))
    }))
    .filter(file => file.descriptors.length > 0);
};
