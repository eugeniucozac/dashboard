import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// app
import { DetailCardView } from './DetailsCard.view';
import { enqueueNotification } from 'stores';

DetailsCard.propTypes = {
  title: PropTypes.node,
  details: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool,
  canCopyText: PropTypes.bool,
  link: PropTypes.bool,
  handleClick: PropTypes.func,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
  }),
};

DetailsCard.defaultProps = {
  width: '100%',
  canCopyText: false,
  isLoading: false,
  handleClick: () => {},
  nestedClasses: {},
};

export function DetailsCard({ title, details, nestedClasses, link, handleClick, width, isLoading, canCopyText }) {
  const dispatch = useDispatch();

  const handleClipBoard = () => {
    if (navigator.clipboard !== undefined) {
      //Chrome and other
      navigator.clipboard.writeText(details).then(
        function () {
          dispatch(enqueueNotification(`Copied to clipboard successfully`, 'success'));
        },
        function (err) {
          dispatch(enqueueNotification(err, 'error'));
        }
      );
    } else if (window.clipboardData) {
      // Internet Explorer
      window.clipboardData.setData('Text', details);
      dispatch(enqueueNotification(`Copied to clipboard successfully`, 'success'));
    }
  }; // this function will be replaced in soon when POC is complete

  return (
    <DetailCardView
      title={title}
      details={details}
      isLoading={isLoading}
      canCopyText={canCopyText}
      width={width}
      link={link}
      handleClick={handleClick}
      handleClipBoard={handleClipBoard}
      nestedClasses={nestedClasses}
    />
  );
}

export default DetailsCard;
