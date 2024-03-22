export const styles = (theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
  row: {
    '& > th, & > td': {
      fontSize: theme.typography.pxToRem(11),
      color: theme.palette.neutral.main,
    },

    '&& > :first-child': {
      paddingLeft: 24,
    },
  },
  title: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  author: {
    fontStyle: 'italic',
  },
  message: {
    marginBottom: theme.spacing(1),
  },
});

export default styles;
