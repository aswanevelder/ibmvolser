# IBM VOLSER SEARCH

A simple NodeJS server for searching backup volumes in IBMs VOLSER TAPE LIBRARY.

The application will list the library of backups display dsn, volumes, job names and job steps etc.
Each file is opened and if a search term entered searched and then displayed as HTML format.

The library information is stored as JSON with the following folder layout:

- daily
   - file1
   - file2
- weekly
   - file1
   - file2
- monthly
   - file1
   - file2
- yearly
   - file1
   - file2

## Installation

Install NodeJS. https://nodejs.org/en/

## Usage

```run
node index.js
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
