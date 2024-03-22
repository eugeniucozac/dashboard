import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';

// app
import { BreadcrumbView } from './Breadcrumb.view';
import * as utils from 'utils';

Breadcrumb.propTypes = {
  links: PropTypes.array,
  testid: PropTypes.string,
};

export default function Breadcrumb({ links, testid }) {
  const location = useLocation();

  // abort
  if (!utils.generic.isValidArray(links, true)) return null;

  return <BreadcrumbView links={links} path={location.pathname} testid={testid} />;
}
