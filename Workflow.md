# Workflow

## Preparation
1. Read all message files
2. Create diff with existing values in `defaultMessage.json`
  1. Added messages
  2. Deleted messages
  3. Changed messages
    Both description and defaultMessage changes, since a different description
    might mean a different context, and thus a different translation
3. Write away as single `defaultLanguage.json` file
  ```json
  [
    {
      id: 'unique message id',
      description: 'message description',
      defaultMessage: 'Actual string message',
      filePath: 'path/to/file/in/project.js'
    }
  ]
  ```

## Per language
1. Read existing `[language].json` file
2. Read existing `status.json` file
3. Filter all deleted messages
  - From language messages
  - From whitelisted keys
4. Add all added messages
  - To language messages
5. Filter all changed messages
  - Filter keys from whitelisted message keys
6. Create `status.json` file
  1. Added messages
    ```json
    [
      {
        id: 'unique message id',
        description: 'message description',
        defaultMessage: 'Actual string message',
        filePath: 'path/to/file/in/project.js'
      }
    ]
    ```
  2. Deleted messages
    ```json
    [
      {
        id: 'unique message id',
        description: 'message description',
        defaultMessage: 'Actual string message',
        translatedMessage: 'Actual translated message value',
        filePath: 'path/to/file/in/project.js'
      }
    ]
    ```
  3. Changed messages
    ```json
    [
      {
        id: 'unique message id',
        old_description: 'message description',
        old_defaultMessage: 'Actual string message',
        description: 'message description',
        defaultMessage: 'Actual string message',
        translatedMessage: 'Actual translated message value',
        filePath: 'path/to/file/in/project.js'
      }
    ]
    ```
  4. Whitelisted messages
7. Write language file
8. Write status file
9. Print results
