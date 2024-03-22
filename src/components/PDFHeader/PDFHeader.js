import React from 'react';
import { PDFHeaderView } from './PDFHeader.view';
import PropTypes from 'prop-types';

PDFHeader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md']),
};

PDFHeader.defaultProps = {
  size: 'md',
};

export function PDFHeader({ size }) {
  return <PDFHeaderView size={size} />;
}

export default PDFHeader;
