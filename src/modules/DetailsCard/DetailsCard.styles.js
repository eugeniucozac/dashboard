const styles = (theme) => ({
  root: ({ width }) => ({
    width: width,
  }),
  container: ({ showHover }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    padding: 8,
    backgroundColor: 'transparent',

    ...(showHover && {
      '&:hover': {
        backgroundColor: theme.palette.neutral.lightest,
      },
    }),
  }),
  content: {
    flex: '1 1 auto',
  },
  title: {
    textAlign: 'left',
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.neutral.darker,
  },
  text: {
    textAlign: 'left',
    color: theme.palette.neutral.darker,
    fontWeight: theme.typography.fontWeightRegular,
  },
  link: {
    marginLeft: theme.spacing(1),
  },
  clipboard: ({ showHover }) => ({
    flex: '0 0 auto',
    textAlign: 'right',
    marginTop: 4,
    visibility: 'visible',
    fontSize: theme.typography.pxToRem(18),
    cursor: 'pointer',
    color: theme.palette.neutral.main,

    ...(showHover && {
      '&:hover': {
        color: theme.palette.neutral.darker,
      },
    }),
  }),
});

export default styles;
