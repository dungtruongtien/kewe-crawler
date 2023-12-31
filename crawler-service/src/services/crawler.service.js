import puppeteer from 'puppeteer';
import axios from 'axios';

import config from '../config/init';
import Keyword from '../models/keyword.model';
import { del, get, set } from '../client/redis.client';

export const crawlerConsumer = async ({ keyword, userId, trackingKey }) => {
  // Call API to google.com
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox'], // Required.
    headless: "new" 
  });
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto(`https://www.google.com/search?q=${keyword}`);

  // Get HTML content
  const html = await page.content();
  // Handle upload file to file service and get path
  const uploadPath = await uploadFile(userId, html);

  // Preocess HTML dom to get crawler info
  const result = await page.evaluate(async () => {
    const result = {
      isDone: false,
      sponsoredLinks: [],
      resultStats: '',
      firstPageLinks: []
    };
    try {
      // Get Sponsored links
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

      // Get search result stat
      const resultStatsElt = document.querySelector('#result-stats');
      if (resultStatsElt) {
        result.searchResultStatistics = resultStatsElt.innerHTML.replace(/(&nbsp;|<nobr>|<\/nobr>)/g, '');
      }

      // Handle get all first page links
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
      htmlStaticLink: `${config.fileServerHost}/${uploadPath}`
    });

    //Process tracking
    processTracking(trackingKey, keyword);
  }
  //TODO update redis to tracking process

}

const uploadFile = async (userId, html) => {
  let data = JSON.stringify({
    "fileName": `${userId}_${new Date().getTime()}`,
    "htmlContent": html
  });

  let requestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${config.fileServerHostLocal}/file/upload`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  const response = await axios.request(requestConfig);
  return response.data.data.path;
}

const processTracking = async (trackingKey, keyword) => {
  const trackingDataStr = await get(trackingKey);
  if (!trackingDataStr) {
    return;
  }
  const { total, listKeywords } = JSON.parse(trackingDataStr);
  const remainKeywords = [];
  let isRemoved = false;
  
  // Remove crawled keyword from cache, if there're multiple same keyword, remove one only
  for (let i = 0; i < listKeywords.length; i++) {
    const processingKeyword = listKeywords[i];
    if (isRemoved || processingKeyword !== keyword) {
      remainKeywords.push(processingKeyword);
      isRemoved = true;
    }
  }
  if (remainKeywords.length === 0) {
    await del(trackingKey);
    return;
  }
  set(trackingKey, JSON.stringify({ listKeywords: remainKeywords, total }));
}