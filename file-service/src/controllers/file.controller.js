import { handleUploadFileSv } from '../services/keyword.service';
import { validator } from '../utils/validator';

export const handleUploadFileCtr = async (req, res, next) => {
  // Validate
  validateKeywordCrawlerInput(req);

  // Handle business logic
  const { htmlContent, fileName } = req.body;
  const path = await handleUploadFileSv(fileName, htmlContent);

  res.json({
    status: "SUCCESS",
    data: { path },
    message: "Upload file successfully"
  })
}

const validateKeywordCrawlerInput = (req) => {
  if (!req.body) {
    throw new Error('Missing body input');
  }
  validator.obj.required(req.body, 'htmlContent');
  validator.obj.required(req.body, 'fileName');
}