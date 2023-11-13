import fs from 'fs';

export const handleUploadFileSv = async (fileName, htmlContent) => {
  fs.writeFileSync(`public/${fileName}.html`, htmlContent, 'utf8');
  return `${fileName}.html`;
}