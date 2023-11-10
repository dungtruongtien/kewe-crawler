// import Keyword from '../models/keyword.model';
// import axios from 'axios';
// import { load } from 'cheerio';
// const puppeteer = require('puppeteer');

// export const crawlerConsumer = async (keyword, userId) => {
//   // Navigate to the URL
//   // const htmlResponse = await axios(`https://www.google.com/search?q=${keyword}&hl=en`);

//   // const result = {
//   //   isDone: false,
//   //   sponsoredLinks: [],
//   //   resultStats: '',
//   //   firstPageLinks: []
//   // };
//   // // console.log('htmlResponse---', htmlResponse);
//   // const $ = load(htmlResponse.data);

//   // const h3Tags = $('h3');

//   // const firstPageLinks = []
//   // h3Tags.each((index, element) => {
//   //   const classes = $(element).attr('class');
//   //   if (classes) {
//   //     // Get parent
//   //     const closestATag = $(element).closest('a');
//   //     if (closestATag) {
//   //       firstPageLinks.push($(element).closest('a').attr('href'))
//   //     }
//   //     return;
//   //   }
//   // });
//   // result.firstPageLinks = firstPageLinks;

//   // const sponsoredLinks = [];
//   // const filteredLinks = $('a').filter((index, element) => {
//   //   const domElement = $(element)
//   //   const href = domElement.attr('href');
//   //   return href && href.includes('google') && href.includes('aclk');
//   // });


//   // // Log the text content of filtered links
//   // filteredLinks.each((index, element) => {
//   //   if (!sponsoredLinks.includes($(element).attr('href'))) {
//   //     sponsoredLinks.push($(element).attr('href'));
//   //   }
//   // });
//   // result.sponsoredLinks = sponsoredLinks;

//   // Call API to google.com
//   const browser = await puppeteer.launch({ headless: "new" });
//   const page = await browser.newPage();

//   // Navigate to the URL
//   await page.goto(`https://www.google.com/search?q=${keyword}&hl=en`);
//   const result = await page.evaluate(() => {
//     const crawlerInfo = {
//       isDone: false,
//       sponsoredLinks: [],
//       resultStats: '',
//       firstPageLinks: []
//     };
//     try {
//       const firstPageLinks = []
//       const h3Elements = document.querySelectorAll('h3');

//       h3Elements.forEach((element) => {
//         const classes = element.getAttribute('class');
//         if (classes) {
//           // Get parent <a> tag
//           const closestATag = element.closest('a');
//           if (closestATag) {
//             firstPageLinks.push(closestATag.getAttribute('href'));
//           }
//         }
//       });
//       crawlerInfo.firstPageLinks = firstPageLinks;

//       // Handle get search result stat
//       const resultStatsElt = document.querySelector('#result-stats');
//       if (resultStatsElt) {
//         crawlerInfo.searchResultStatistics = resultStatsElt.innerHTML.replace(/(&nbsp;|<nobr>|<\/nobr>)/g, '');
//       }
//       return crawlerInfo;
//     } catch (err) {
//       //TODO: Add logger to debug
//     }
//   });
//   await browser.close();
//   console.log('result----', result);
//   // if (!searchResultStatistics) {
//   //   //TODO: handle error logic;
//   //   return;
//   // }
//   // result.searchResultStatistics = searchResultStatistics;

//   // try {
//   //   // Save to database
//   //   await Keyword.create({
//   //     userId,
//   //     keyword,
//   //     totalAdWordsAdvertisers: result.sponsoredLinks.length,
//   //     adWordsAdvertisers: result.sponsoredLinks,
//   //     totalLinks: result.firstPageLinks.length,
//   //     links: result.firstPageLinks,
//   //     searchResultStatistics: result.searchResultStatistics,
//   //     // htmlStaticLink
//   //   });
//   //   //TODO update redis to tracking process
//   // } catch (error) {
//   //   console.log('error------', error);
//   //   // Handle retry in with this message after n second.
//   // }
// }




import Keyword from '../models/keyword.model';
const puppeteer = require('puppeteer');
import fs from 'fs';

export const crawlerConsumer = async (keyword, userId) => {
  // Call API to google.com
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto(`https://www.google.com/search?q=${keyword}`);

  // Get HTML content
  const html = await page.content();
  console.log(html);
  await fs.writeFileSync('public/example.html', html, 'utf8');

  const result = await page.evaluate(async () => {
    const result = {
      isDone: false,
      sponsoredLinks: [],
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
      const sponsoredLinks = [];
      const allLinks = document.querySelectorAll('a');

      allLinks.forEach((element) => {
        const attribute = element.getAttribute('data-rw');
        if (attribute && attribute.includes('google') && attribute.includes('aclk')) {
          sponsoredLinks.push(attribute);
        }
      });
      result.sponsoredLinks = sponsoredLinks;

      // Handle get search result stat
      const resultStatsElt = document.querySelector('#result-stats');
      if (resultStatsElt) {
        result.searchResultStatistics = resultStatsElt.innerHTML.replace(/(&nbsp;|<nobr>|<\/nobr>)/g, '');
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
      return err;
    }
  });

  await browser.close();

  console.log('result----', result);
  
  try {
    // Save to database
    if (result.isDone) {
      await Keyword.create({
        keyword,
        userId,
        totalAdWordsAdvertisers: result.sponsoredLinks.length,
        adWordsAdvertisers: result.sponsoredLinks,
        totalLinks: result.firstPageLinks.length,
        links: result.firstPageLinks,
        searchResultStatistics: result.searchResultStatistics,
        // htmlStaticLink
      });
    }
    //TODO update redis to tracking process
  } catch (error) {
    console.log('error------', error);
    // Handle retry in with this message after n second.
  }

}