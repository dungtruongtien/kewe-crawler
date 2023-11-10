import Keyword from '../models/keyword.model';
const puppeteer = require('puppeteer');

export const crawlerConsumer = async (keyword, userId) => {
  // Call API to google.com
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto(`https://www.google.com/search?q=${keyword}`);

  const result = await page.evaluate(() => {
    const result = {
      isDone: false,
      sponsoredInfos: [],
      resultStats: '',
      firstPageLinks: []
    };
    try {
      // Handle get Sponsored element
      /*
        Sponsored element
        <div>
          <a>
            <div>
              <span>
      */
      const spanElements = document.querySelectorAll('span');
      let sponsoredInfos = [];
      if (!spanElements) {
        return sponsoredInfos;
      };
      for (let i = 0; i < spanElements.length; i++) {
        const element = spanElements[i];
        if (element.textContent.includes('Sponsored') || element.textContent.includes('Được tài trợ')) {
          sponsoredElt = element;
          let sponsoredEltSilbingDiv = sponsoredElt.parentNode.querySelector('div'); // sponsored -> sil
          let sponsoredEltSilbingDivAtag = sponsoredEltSilbingDiv.querySelector('a');
          let sponsoredEltSilbingDivAtagDiv = sponsoredEltSilbingDivAtag.querySelector('div');
          let sponsoredEltSilbingDivAtagDivSpan = sponsoredEltSilbingDivAtagDiv.querySelector('span');
          sponsoredInfos.push({
            title: sponsoredEltSilbingDivAtagDivSpan.innerHTML,
            url: sponsoredEltSilbingDivAtag.href
          })
        }
      }
      result.sponsoredInfos = sponsoredInfos;

      // Handle get search result stat
      const resultStatsElt = document.querySelector('#result-stats');
      if (resultStatsElt) {
        result.resultStats = resultStatsElt.innerHTML.replace(/(&nbsp;|<nobr>|<\/nobr>)/g, '');
      }

      // Handle get search result
      // Find all a tag that have ping attribute and children element is h3
      const elements = document.querySelectorAll('a');
      const firstPageLinks = [];

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.querySelector('h3')) {
          if (element.href && !element.href.includes('www.google.com')) {
            firstPageLinks.push(element.href);
          }
        }
      }
      result.firstPageLinks = firstPageLinks;
      result.isDone = true;
      return result;
    } catch (err) {
      //TODO: Add logger to debug
      return result;
    }
  });

  await browser.close();
  
  try {
    // Save to database
    if (result.isDone) {
      await Keyword.create({
        userId,
        totalAdWordsAdvertisers: result.sponsoredInfos.length,
        adWordsAdvertisers: result.sponsoredInfos,
        totalLinks: result.firstPageLinks.length,
        links: result.firstPageLinks,
        searchResult: result.resultStats,
        // htmlStaticLink
      });
    }
    //TODO update redis to tracking process
  } catch (error) {
    console.log('error------', error);
    // Handle retry in with this message after n second.
  }

}