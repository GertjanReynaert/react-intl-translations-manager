import getLanguageReport, { getCleanReport } from '../src/getLanguageReport';

describe('getLanguageReport', () => {
  it('should give back an empty report for an input without messages', () => {
    const actual = getLanguageReport({}, {}, []);

    expect(actual).toEqual(getCleanReport());
  });

  it('should give back an new report for an input without a translation file', () => {
    const actual = getLanguageReport(
      {
        test_message: 'This is a test message'
      },
      undefined,
      []
    );

    const expected = {
      ...getCleanReport(),
      added: [
        {
          key: 'test_message',
          message: 'This is a test message'
        }
      ],
      fileOutput: {
        test_message: 'This is a test message'
      }
    };

    expect(actual).toEqual(expected);
  });

  it('should give back a report with added messages', () => {
    const actual = getLanguageReport(
      {
        test_message: 'This is a test message'
      },
      {},
      []
    );

    const expected = {
      ...getCleanReport(),
      added: [
        {
          key: 'test_message',
          message: 'This is a test message'
        }
      ],
      fileOutput: {
        test_message: 'This is a test message'
      }
    };

    expect(actual).toEqual(expected);
  });

  it('should give back a report with untranslated messages', () => {
    const actual = getLanguageReport(
      {
        test_message: 'This is a test message'
      },
      {
        test_message: 'This is a test message'
      },
      []
    );

    const expected = {
      ...getCleanReport(),
      untranslated: [
        {
          key: 'test_message',
          message: 'This is a test message'
        }
      ],
      fileOutput: {
        test_message: 'This is a test message'
      }
    };

    expect(actual).toEqual(expected);
  });

  it('should give back a report with deleted messages', () => {
    const actual = getLanguageReport(
      {},
      {
        test_message: 'This is a test message'
      },
      []
    );

    const expected = {
      ...getCleanReport(),
      deleted: [
        {
          key: 'test_message',
          message: 'This is a test message'
        }
      ]
    };

    expect(actual).toEqual(expected);
  });

  it('should give back a detailed report', () => {
    const actual = getLanguageReport(
      {
        added_message: 'This is an added message',
        existing_message: 'This is an existing message',
        untranslated_message: 'This is an untranslated message',
        whitelisted_message: 'This is an whitelisted message'
      },
      {
        existing_message: 'Translated version of existing message',
        untranslated_message: 'This is an untranslated message',
        whitelisted_message: 'This is an whitelisted message',
        deleted_message: 'This is a deleted message',
        deleted_whitelisted_message: 'This is a deleted whitelisted message'
      },
      ['whitelisted_message', 'deleted_whitelisted_message']
    );

    const expected = {
      added: [
        {
          key: 'added_message',
          message: 'This is an added message'
        }
      ],
      untranslated: [
        {
          key: 'untranslated_message',
          message: 'This is an untranslated message'
        }
      ],
      deleted: [
        {
          key: 'deleted_message',
          message: 'This is a deleted message'
        },
        {
          key: 'deleted_whitelisted_message',
          message: 'This is a deleted whitelisted message'
        }
      ],
      fileOutput: {
        added_message: 'This is an added message',
        existing_message: 'Translated version of existing message',
        untranslated_message: 'This is an untranslated message',
        whitelisted_message: 'This is an whitelisted message'
      },
      whitelistOutput: ['whitelisted_message']
    };

    expect(actual).toEqual(expected);
  });
});
