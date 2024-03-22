import React from 'react';
import PropTypes from 'prop-types';

// app
import { PDFCommentsView } from './PDFComments.view';

PDFComments.propTypes = {
  comments: PropTypes.array,
  subjectivities: PropTypes.string,
  title: PropTypes.string,
};

PDFComments.defaultProps = {
  comments: [],
};

export default function PDFComments({ comments, subjectivities, title }) {
  return <PDFCommentsView comments={comments} subjectivities={subjectivities} title={title} />;
}
