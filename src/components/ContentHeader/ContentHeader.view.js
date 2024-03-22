import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ContentHeader.styles';

// mui
import { makeStyles, Box, Divider, Typography } from '@material-ui/core';

ContentHeaderView.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.node,
  marginTop: PropTypes.number.isRequired,
  marginBottom: PropTypes.number.isRequired,
};

export default function ContentHeaderView({ title, subtitle, content, marginTop, marginBottom }) {
  const classes = makeStyles(styles, { name: 'ContentHeader' })();

  return (
    <Box width={1} mt={marginTop} mb={marginBottom}>
      {/* by default, title and subtitle are displayed */}
      {!content && (title || subtitle) && (
        <Box display="flex" alignItems="flex-end">
          {title && <Typography className={classes.title}>{title}</Typography>}
          {subtitle && <Typography className={classes.subtitle}>{subtitle}</Typography>}
        </Box>
      )}

      {/* if necessary, custom content can override title/subtitle props */}
      {content && <Box>{content}</Box>}
      <Divider className={classes.divider} />
    </Box>
  );
}
