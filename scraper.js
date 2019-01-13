const puppeteer = require('puppeteer');
const argv = require('yargs').argv;

(async () => {
  const browser = await puppeteer.launch();
  const amazonIT = await browser.newPage();
  const amazonES = await browser.newPage();
  const amazonFR = await browser.newPage();
  const amazonDE = await browser.newPage();
  const amazonUK = await browser.newPage();

  const amazons = [
    {
      page: amazonIT,
      url: 'https://www.amazon.it',
      country: 'Italy'
    },
    {
      page: amazonES,
      url: 'https://www.amazon.es',
      country: 'Spain'
    },
    {
      page: amazonFR,
      url: 'https://www.amazon.fr',
      country: 'France'
    },
    {
      page: amazonDE,
      url: 'https://www.amazon.de',
      country: 'Germany'
    },
    {
      page: amazonUK,
      url: 'https://www.amazon.co.uk',
      country: 'UK'
    }
  ];

  const results = {};

  // we can use a for operator to handle asynchronous operations
  for (let i = 0; i < amazons.length; i++) {
    // go to page
    await amazons[i].page.goto(amazons[i].url);
    // focus input field
    await amazons[i].page.focus('.nav-search-field > input')
    // insert search key
    await amazons[i].page.keyboard.type(argv.searchKey);
    // submit form
    await amazons[i].page.click('input.nav-input');
    // wait for result page to be loaded
    await amazons[i].page.waitForNavigation({ waitUntil: 'networkidle0' });
    // traverse DOM to get item name and link
    const amazonItemsDetails = await amazons[i].page.evaluate(() => 
      Array
        .from(document.querySelectorAll('a.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal'))
        .map(item => ({
          name: item.innerText,
          link: item.href
      })));
    // traverse DOM to get item price
    const amazonitemsPrice = await amazons[i].page.evaluate(() => 
      Array.from(document.querySelectorAll(
        'span.a-size-base.a-color-price.s-price.a-text-bold'
        )).map(item => item.innerText.trim()));
    // add price to item detail object
    amazonitemsPrice.forEach((price, i) => amazonItemsDetails[i].price = price);
    // add items details for given country to results object
    results[amazons[i].country] = amazonItemsDetails;
  }
  
  await browser.close();

  console.log(results);
  // return results object
  return results;
  
})();
