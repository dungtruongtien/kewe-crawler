import React, { useEffect, useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';

import { capitalizeFirstLetter } from '../util/method';

function KWBreadcrumb() {
  const [breadcumbData, setBreadcumbData] = useState([]);

  useEffect(() => {
    // Convert URL to breadcumb, e.g: /a/b/c
    const paths = window.location.pathname;
    const pathNames = paths.split('/').filter(path => !!path);
    let url = '';
    const data = pathNames.map((name, idx) => {
      const isActive = idx === pathNames.length - 1;
      url = url + `/${name}`;
      return {
        isActive, url, name
      }
    });
    setBreadcumbData(data);
  }, [])

  return (
    <Breadcrumb>
      {breadcumbData.map((data) => {
        return <Breadcrumb.Item key={data.name} active={data.isActive}>
          <Link to={`/${data.url}`}>{capitalizeFirstLetter(data.name)}</Link>
        </Breadcrumb.Item>
      })}
    </Breadcrumb>
  );
}

export default KWBreadcrumb;