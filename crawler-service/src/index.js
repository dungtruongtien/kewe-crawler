import sequelizeService from "./client/db";
import { crawlerConsumer } from "./services/crawler.service";

sequelizeService.init().then(() => {
  const keyword = 'shoppe';
  const userId = 1;
  crawlerConsumer(keyword, userId);
}).catch(error => {
  console.log('error----', error);
})
