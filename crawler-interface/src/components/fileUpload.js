import React from 'react';

function FileUpload({ isDisabled, processData }) {
  return (
    <div className='upload-wrapper'>
      <div className='title'>Upload CSV</div>
      <input disabled={isDisabled} onChange={processData} type="file" />
    </div>
  )
}

export default FileUpload;