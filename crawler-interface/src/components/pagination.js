import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';


function KWPagination({ handleChangePage, pageInfo }) {
  console.log('pageInfo----', pageInfo);
  const items = [<Pagination.Item value={-2} onClick={handleChangePage} key={-2}>{'<<'}</Pagination.Item>];
  for (let number = 1; number <= pageInfo.totalPagination; number++) {
    items.push(
      <Pagination.Item onClick={handleChangePage} value={number} key={number} active={number === pageInfo.currentPage}>
        {number}
      </Pagination.Item>,
    );
  }
  items.push(<Pagination.Item onClick={handleChangePage} value={-1} key={-1}>{'>>'}</Pagination.Item>);
  return (
    <Pagination>{items}</Pagination>

  );
}

export default KWPagination;