import React from 'react';
import PropTypes from 'prop-types';

// app
import ContentHeaderView from './ContentHeader.view';

ContentHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.node,
  marginTop: PropTypes.number.isRequired,
  marginBottom: PropTypes.number.isRequired,
};

ContentHeader.defaultProps = {
  marginTop: 5,
  marginBottom: 2,
};

export function ContentHeader(props) {
  const { title, subtitle, content } = props;

  // abort
  if (!title && !subtitle && !content) return null;

  return <ContentHeaderView {...props} />;
}

export default ContentHeader;
