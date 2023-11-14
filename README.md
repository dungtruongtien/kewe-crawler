<h1 align="center">KEWE Crawler</h1>

<p align="center">Crawler service in order to crawl keyword from Google search, user can also preview their crawling information with built-in dashboard</p>

## Table of Contents
  - [How do I crawl?](#how-do-i)
  - [Browser Support](#browser-support)
  - [Installing](#installing)
    - [Package manager](#package-manager)
    - [CDN](#cdn)
 
## How did I crawl keyword from Google Search?
- Use puppeteer to act like a browser, each keyword will be requested to https://www.google.com/search?q={keyword}.
- After request successfully, use DOM API to get all needed information from search result: Ads links, first page links, result statistic.
- To prevent Google marks this service as a bot, I'm using message queue to crawl all keyword sequentially, delay 2s between each keyword.
- The below diagram will be descript the overall crawler workflow:
![Alt text](relative%20path/to/img.jpg?raw=true "Title")