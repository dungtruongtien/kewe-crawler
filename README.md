<h1 align="center">KEWE Crawler</h1>

<p align="center">Crawler service in order to crawl keyword from Google search, user can also preview their crawling information with built-in dashboard</p>

## Table of Contents
  - [Features](#Features)
  - [How to test](#how-to-test)
  - [Installing](#installing)
    - [UAT Environment](#uat-environment)
    - [Local Environment](#local-environment)
 
## Features
- Use puppeteer to act like a browser, each keyword will be requested to `https://www.google.com/search?q={keyword}`.
- After request successfully, use DOM API to get all needed information from search result: Ads links, first page links, result statistic.
- To prevent Google marks this service as a bot, I'm using message queue to crawl all keyword sequentially, delay 2s between each keyword.
- The below diagram will be descript the overall crawler workflow:
![alt text](https://raw.githubusercontent.com/dungtruongtien/kewe-crawler/main/crawl-workflow..png)

## How to test
### &nbsp;&nbsp; UAT Environment
- Update...

### &nbsp;&nbsp; Local Environment
### &nbsp;&nbsp; With native
**Prerequisite**
```ts
  Node v18.17.0
  RabbitMQ 3.11.8-management
  Redis 6.2.0
  Postgres 16.1
````

**Step to install project**
Step 1: Clone project from github. <br />
Step 2: Init postgres database and seeding by using `init.sql` at root directory. <br />
Step 2: Navigate to the root of project. <br />
Step 3: Install dependencies and env for backend service: `api-service`, `file-service`, `crawler-service`. <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 3.1: Navigate to backend service folder. <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 3.2: run `npm install`. <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 3.3: run `cp .sample.env .env`. <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 3.3: update .env variables based on your `rabbitmq`, `redis`, `postgres` config. <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 3.4: run `npm run dev`. <br />
Step 4: Install dependencies and env for frontend service. <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 4.1: Navigate to `crawler-interface` folder <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 4.2: run `npm install`. <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 4.3: run `cp .sample.env .env`. <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 4.3: update .env variable base on your `api-service` config. <br />
&nbsp;&nbsp;&nbsp;&nbsp; Step 4.4: run `npm run start`. <br />
Step 5: Access to localhost:3000 and use sample file (keywords.csv at root director) for testing. <br />

### &nbsp;&nbsp; With Docker
**Prerequisite**

```ts
  Docker version 20.10.17 
  Docker-compose version 1.29.2
````

**Step to install project**
Step 1: Clone project from github. <br />
Step 2: Navigate to the root of project. <br />
Step 3: Insert this command to your terminal: `docker-compose up -d`. <br />
Step 4: Access to localhost:3000 and use sample file (keywords.csv at root director) for testing. <br />
