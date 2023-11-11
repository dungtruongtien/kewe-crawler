import fs from 'fs';

export const handleUploadFileSv = async (fileName, htmlContent) => {
  await fs.writeFileSync(`public/${fileName}.html`, htmlContent, 'utf8');
  return `${fileName}.html`;
}