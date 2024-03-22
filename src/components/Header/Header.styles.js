const styles = (theme) => ({
  toolbar: {
    minHeight: theme.mixins.header.default.minHeight - 3, // minus 3px for border-top

    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
    },
  },
});

export default styles;
