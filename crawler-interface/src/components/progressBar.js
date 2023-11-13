import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

function KWProgressBar({now}) {
  return <ProgressBar animated now={now} label={`${now}%`} />;
}

export default KWProgressBar;