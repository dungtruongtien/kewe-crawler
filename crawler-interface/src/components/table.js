import React from 'react';
import Table from 'react-bootstrap/Table';

export function KWTable({ columns, data, isLoading = false }) {
  return (
    <Table className={isLoading && 'loading'} responsive>
      <thead>
        <tr>
          <th></th>
          {columns.map((column, index) => (
            <th key={index}>{column.text}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((value, idx) => (
          <tr key={idx}>
            <td>{idx + 1}</td>
            {columns.map((column, index) => {
              if(column.render) {
                return <td key={index}>{column.render(value[column.data])}</td>
              }              
              return (
                <td key={index}>{value[column.data]}</td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default KWTable;