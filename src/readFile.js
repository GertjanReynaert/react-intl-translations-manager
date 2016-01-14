import { readFileSync } from 'fs';

export default filename => {
  try {
    return readFileSync(filename, 'utf8');
  } catch (err) {
    return undefined;
  }
};
