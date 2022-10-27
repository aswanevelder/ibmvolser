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
- VOLSER_TOKEN is a required hash generated with token.js. Please see section Token.
- VOLSER_TOKEN_EXPIRE_MIN is minutes till token expire, default is 10 minutes.
```bash
node index.js
```

## Generate Token

You will require to generate and store the token as an envrironment variable for authorization.

Run the following command with your chosen username and password.
```bash
node token.js username password
```
Set Environment Variable with the output hash example of username and password below.

- VOLSER_TOKEN=ff987151403cf7848f70b8910d9fe7ea29642de3aa5d925f73ef2ae7d6ea56c0

## License
[MIT](https://choosealicense.com/licenses/mit/)
