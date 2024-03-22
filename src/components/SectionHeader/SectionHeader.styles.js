const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap',
  },
  content: {
    display: 'flex',
    flex: '1 1 auto',
    flexWrap: 'noWrap',
    alignItems: 'flex-start',
    marginRight: theme.spacing(4),
    marginBottom: theme.spacing(3),
    minWidth: 0,
  },
  children: {
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'flex-end',
    flexDirection: 'column',
    marginBottom: theme.spacing(3),
    minWidth: 160,

    [theme.breakpoints.up('sm')]: {
      flex: '1 0 40%',
      margin: 0,
      marginTop: 2,
    },
  },
  icon: {
    flex: '0 1 auto',
    marginRight: theme.spacing(1.5),
    fontSize: theme.spacing(4),
    color: theme.palette.primary.main,

    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(5),
    },

    '& > svg': {
      display: 'block',
    },
  },
  details: {
    flex: 1,
    minWidth: 0, // for ellipsis
    marginTop: 2,
  },
  title: ({ hasSubtitle }) => ({
    marginTop: `${hasSubtitle ? -8 : 0}px !important`,
    marginBottom: 0,
  }),
  subtitle: {
    '& .small': {
      color: theme.palette.neutral.main,
      fontSize: '90%',
      fontStyle: 'italic',
    },
  },
});

export default styles;
