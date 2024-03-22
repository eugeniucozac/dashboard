import { Fragment } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { FormGrid } from 'components';

const FormSkeleton = () => {
  return (
    <FormGrid container spacing={4}>
      {[...new Array(3)].map((item, index) => (
        <Fragment key={`skeleton-${index}`}>
          <FormGrid item xs={12}>
            <Skeleton height={30} width={100} />
          </FormGrid>
          <FormGrid item xs={12}>
            <FormGrid container spacing={4}>
              <FormGrid item xs={12} md={4}>
                <Skeleton height={16} />
                <Skeleton height={30} variant="rect" />
              </FormGrid>
              <FormGrid item xs={12} md={4}>
                <Skeleton height={16} />
                <Skeleton height={30} variant="rect" />
              </FormGrid>
              <FormGrid item xs={12} md={4}>
                <Skeleton height={16} />
                <Skeleton height={30} variant="rect" />
              </FormGrid>
            </FormGrid>
          </FormGrid>
        </Fragment>
      ))}
    </FormGrid>
  );
};

export default FormSkeleton;
