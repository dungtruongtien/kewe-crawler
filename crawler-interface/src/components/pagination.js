import React from 'react';
import Pagination from 'react-bootstrap/Pagination';


function KWPagination({ handleChangePage, pageInfo }) {
  const items = [];
  for (let number = 1; number <= pageInfo.totalPagination; number++) {
    items.push(
      <Pagination.Item onClick={handleChangePage} value={number} key={number} active={number === pageInfo.currentPage}>
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <Pagination>{items}</Pagination>

  );
}

export default KWPagination;