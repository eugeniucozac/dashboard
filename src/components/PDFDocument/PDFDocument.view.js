import React from 'react';

// app
import PDFCover from 'components/PDFCover/PDFCover';
import PropTypes from 'prop-types';

PDFDocumentView.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export function PDFDocumentView({ title, subtitle, children }) {
  return (
    <div>
      <PDFCover title={title} subtitle={subtitle} />
      <div>{children}</div>
    </div>
  );
}
