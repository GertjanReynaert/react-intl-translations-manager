import Path from 'path';
import { writeFileSync } from 'fs';

export default ({
  messages,
  directory,
  fileName = 'defaultMessages.json',
  jsonSpaceIndentation = 2,
}) => {
  if (!messages) throw new Error('messages are required');

  if (!directory || typeof directory !== 'string' || directory.length === 0) {
    throw new Error('directory is required');
  }

  const DIR = Path.join('./', directory, fileName);

  writeFileSync(DIR, JSON.stringify(messages, null, jsonSpaceIndentation));
};
