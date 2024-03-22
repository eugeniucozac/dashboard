import React from 'react';
import PropTypes from 'prop-types';

// app
import { RowDetailsView } from './RowDetails.view';

RowDetails.propTypes = {
  title: PropTypes.node,
  details: PropTypes.string,
  textAlign: PropTypes.string,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    title: PropTypes.string,
    details: PropTypes.string,
  }),
  handleClick: PropTypes.func,
  'data-testid': PropTypes.string,
};

RowDetails.defaultProps = {
  textAlign: 'left',
  nestedClasses: {},
};

export function RowDetails({ title, details, textAlign, nestedClasses, link, handleClick }) {
  return (
    <RowDetailsView
      title={title}
      details={details}
      textAlign={textAlign}
      nestedClasses={nestedClasses}
      link={link}
      handleClick={handleClick}
    />
  );
}

export default RowDetails;
