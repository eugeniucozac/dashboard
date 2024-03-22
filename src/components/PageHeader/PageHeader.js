import React from 'react';
import PropTypes from 'prop-types';

// app
import { PageHeaderView } from './PageHeader.view';
import * as utils from 'utils';

PageHeader.propTypes = {
  logo: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.object,
      title: PropTypes.string,
      content: PropTypes.node,
    })
  ),
};

export default function PageHeader(props) {
  // abort
  if (!props.logo && utils.generic.isInvalidOrEmptyArray(props.items)) return null;

  return <PageHeaderView {...props} />;
}
