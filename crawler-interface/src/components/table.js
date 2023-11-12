import React from 'react';
import Table from 'react-bootstrap/Table';

export function KWTable() {

  function handleHTMLOnClick() {
    const popupWidth = 1000;
    const popupHeight = 1000;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;
  
    // Define the window features, including size and position.
    const features = `width=${1000},height=${1000},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,location=no`;
  
    window.open('http://localhost:8082/1_1699632398688.html', 'windowName', features);
  }

  return (
    <Table responsive>
      <thead>
        <tr>
          {Array.from({ length: 5 }).map((_, index) => (
            <th key={index}>Table heading</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td style={{ cursor: 'pointer' }} onClick={handleHTMLOnClick}>HTML click me</td>
          {Array.from({ length: 3 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
      </tbody>
    </Table>
  );
}

export default KWTable;