import React from 'react';
import Pagination from 'react-bootstrap/Pagination';


function KWPagination() {
  let active = 2;
  const items = [<Pagination.Item key={-2}>{'<<'}</Pagination.Item>];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
  }
  items.push(<Pagination.Item key={-1}>{'>>'}</Pagination.Item>);
  return (
    <Pagination>{items}</Pagination>

  );
}

export default KWPagination;