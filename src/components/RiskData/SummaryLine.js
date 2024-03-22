import { FormGrid } from 'components';

import { Typography } from '@material-ui/core';

const SummaryLine = ({ summary, classes }) => {
  return (
    <>
      <FormGrid item xs={4} align="right">
        <Typography variant="body2" align="right" className={classes.quoteValueTitle}>
          {summary.title}
        </Typography>
      </FormGrid>
      <FormGrid item xs={8} align="left">
        <Typography variant="body2" align="left" className={classes.quoteValue}>
          {summary?.value ? summary.value : null}
        </Typography>
      </FormGrid>
    </>
  );
};

export default SummaryLine;
