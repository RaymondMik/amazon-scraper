# Amazon Scraper
A web scraper application built with Node.js and Puppeteer to extract data from multi-country Amazon pages.

## CLI application
Currently only a CLI application is available. To use it run `node scraper.js --searchKey=[item_name]` e.g. `node scraper.js --searchKey="rubber duck"` and you will get the first page results for `"rubber duck"` from Amazon IT, FR, ES, DE and UK. Countries are for now hardcoded.

