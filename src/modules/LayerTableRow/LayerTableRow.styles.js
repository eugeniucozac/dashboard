const styles = (theme) => ({
  row: {
    lineHeight: 1,
    backgroundColor: theme.palette.neutral.lightest,
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    '&& > td': {
      borderBottom: 0,
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
});

export default styles;
