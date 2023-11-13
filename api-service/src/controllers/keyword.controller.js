import { validator } from '../utils/validator';
import { handleKeywordCrawlerSv, handleKeywordProcessTrackingSv, handleListKeywordSv } from '../services/keyword.service';

export const handleKeywordCrawlerCtr = async (req, res, next) => {
  try {
    // Validate
    validateKeywordCrawlerInput(req);

    // Handle business logic
    const { userId } = res.locals.user;
    const { listKeywords } = req.body;
    const resp = await handleKeywordCrawlerSv({ listKeywords, userId });
    res.status(200).json({
      message: 'Your list of keyword is crawling',
      status: 'SUCCESS',
      data: resp,
    })

  } catch (err) {
    next(err);
  }
}

export const handleKeywordProcessTrackingCtr = async (req, res, next) => {
  try {
    // Validate
    validateKeywordProcessTrackingInput(req);

    // Handle business logic
    const { trackingKey } = req.query;
    const data = await handleKeywordProcessTrackingSv({ trackingKey });
    res.status(200).json({
      status: 'SUCCESS',
      data: JSON.parse(data),
    })

  } catch (err) {
    next(err);
  }
}

export const handleListKeywordCtr = async (req, res, next) => {
  try {
    // Handle validation
    validateListKeywordInput(req);

    const { userId } = res.locals.user;
    const { attributes: attributesQuery, limit, page } = req.query;
    let offset = 0;
    if (page) {
      offset = (page - 1) * limit;
    }
    let attributes = undefined;
    if (attributesQuery) {
      //TODO: Handle validate enum with Keyword column
      attributes = attributesQuery.split(',');
    }
    const listKeywords = await handleListKeywordSv({ userId, attributes, limit, offset });

    res.json({
      status: 'SUCCESS',
      data: listKeywords
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


const validateListKeywordInput = (req) => {
  const { limit, page } = req.query;
  validator.number.isNumber(limit, 'limit');
  validator.number.isNumber(page, 'offset');
}

const validateKeywordProcessTrackingInput = (req) => {
  validator.obj.required(req.query, 'trackingKey');
  const { trackingKey } = req.query;
  validator.string.isString(trackingKey, 'trackingKey');
}