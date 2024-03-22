const styles = (theme) => ({
  defaultMenuItem: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    marginTop: '-5px',

    '&:hover': {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  },
});

export default styles;
