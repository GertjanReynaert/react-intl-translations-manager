import Path from 'path';
import { writeFileSync } from 'fs';
import stringify from './stringify';

export default ({
  messages,
  directory,
  fileName = 'defaultMessages.json',
  sortKeys = true,
  jsonSpaceIndentation = 2,
}) => {
  if (!messages) {
    throw new Error('Messages are required');
  }

  if (!directory || typeof directory !== 'string' || directory.length === 0) {
    throw new Error('Directory is required');
  }

  const DIR = Path.join(directory, fileName);

  writeFileSync(
    DIR,
    stringify(messages, { space: jsonSpaceIndentation, sortKeys })
  );
};
