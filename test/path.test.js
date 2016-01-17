import { expect } from 'chai';
import Path from 'path';

// Tests merely for my own confidence
describe('Path', () => {
  it('Path.join folder', () => {
    expect(Path.join('./', './folder')).to.equal('folder');
  });

  it('Path.join file', () => {
    expect(Path.join('./', './folder', 'file.json')).to.equal('folder/file.json');
  });
});
