import { expect } from 'chai';

import getLanguageReport, { initialReport } from '~/src/getLanguageReport';

describe('getLanguageReport', () => {
  it('should give back an empty report for an input without messages', () => {
    const actual = getLanguageReport({}, {}, []);

    expect(actual).to.deep.equal(initialReport);
  });
});
