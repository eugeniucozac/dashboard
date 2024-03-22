import times from 'lodash/times';

import Skeleton from '@material-ui/lab/Skeleton';

const MUISkeleton = ({ height, animation, width = '100%', displayNumber = 10 }) => {
  const skeletons = times(displayNumber, String);

  return (
    <>
      {skeletons.map((value) => (
        <Skeleton key={`skeleton-${value}`} width={width} height={height} animation={animation} />
      ))}
    </>
  );
};

export default MUISkeleton;
