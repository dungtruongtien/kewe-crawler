import React from 'react';

function FileUpload({ processData }) {
  return (
    <div className='upload-wrapper'>
      <div className='title'>Upload CSV</div>
      <input onChange={processData} type="file" />
    </div>
  )
}

export default FileUpload;