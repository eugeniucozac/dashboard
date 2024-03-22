const styles = (theme) => ({
  grid: {
    transition: theme.transitions.create(['padding']),
  },
  gridCollapsed: {
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
  },
  spacer: {
    padding: '0 !important',
  },
  legend: {
    '&:not(:first-child) > legend': {
      marginTop: '0px !important',
    },
    '& > legend': {
      marginBottom: 0,
    },
  },
});

export default styles;
