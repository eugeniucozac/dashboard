import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

usePrevious.propTypes = {
  value: PropTypes.any.isRequired,
};

export default function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
