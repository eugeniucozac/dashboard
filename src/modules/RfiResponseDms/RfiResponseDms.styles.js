const styles = (theme) => ({
  root: {
    margin: theme.spacing(0, 1.5),
    width: `100%`,
  },
  dmsWrapper: {
    width: '100%',
    margin: `0 ${theme.spacing(2)}px`,
  },
  toggleBtnLink: {
    fontSize: `${theme.typography.pxToRem(13)} !important`,
    textTransform: 'uppercase',
  },
  toggleBtnIcon: ({ expanded }) => ({
    fontSize: `${theme.typography.pxToRem(24)} !important`,
    transform: `scaleY(${expanded ? 1 : -1}) !important`,
    transition: theme.transitions.create('transform'),
  }),
});

export default styles;
