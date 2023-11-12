import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

function KWProgressBar() {
  return <ProgressBar animated now={60} label={'60%'} />;
}

export default KWProgressBar;