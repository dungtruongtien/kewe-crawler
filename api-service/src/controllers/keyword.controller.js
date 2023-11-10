import { validator } from '../utils/validator';
import { handleKeywordCrawlerSv } from '../services/keyword.service';

export const handleKeywordCrawlerCtr = async (req, res, next) => {
  try {
    // Validate
    validateKeywordCrawlerInput(req);

    // Handle business logic
    const { listKeywords } = req.body;
    await handleKeywordCrawlerSv(listKeywords);
    res.status(200).json({
      message: 'Your list of keyword is crawling',
      status: 'SUCCESS'
    })

  } catch (err) {
    next(err);
  }
}

const validateKeywordCrawlerInput = (req) => {
  if (!req.body) {
    throw new Error('Missing body input');
  }
  validator.obj.required(req.body, 'listKeywords');
  const { listKeywords } = req.body;
  validator.array.minLen(listKeywords, 0);
  validator.array.maxLen(listKeywords, 100);
  validator.array.eachString(listKeywords);
}