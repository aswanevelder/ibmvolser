# IBM VOLSER SEARCH

A simple NodeJS server for searching the meta data for an IBM VOLSER TAPE LIBRARY.

![Screenshot](https://s3.eu-central-1.amazonaws.com/com.trublo.assets/search-example.png)

The application will list the library of backups displaying dsn, volumes, job names and job steps etc.
Each file is opened in the chosen date directory and if a search term entered searched and then displayed as HTML.

The library information is stored as JSON with the following folder layout:

- daily
   - 2022.10.15
      - file1
      - file2
- weekly
   - 2022.10.15
      - file1
      - file2
- monthly
   - 2022.10.15
      - file1
      - file2
- yearly
   - 2022.10.15
      - file1
      - file2

## Installation

Install NodeJS. https://nodejs.org/en/

## Usage

Environment variables: 

- VOLSER_LOCATION will be used as the directory. If this is not set the default will be ./reports.
- VOLSER_TIMEZONE will be used as the timezone to determine the directory layout. The default is en-ZA which translates to yyyy.MM.dd 

```run
node index.js
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
