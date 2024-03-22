const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    cursor: 'pointer',
  },
  rowSelected: {
    background: theme.palette.grey[100],
  },
  titleWrapper: {
    order: -1,
    marginBottom: 12,
  },
  title: {
    flex: '1 1 auto',
    marginLeft: -7,
    fontSize: theme.typography.pxToRem(18),
    transition: theme.transitions.create('margin'),
    ...theme.mixins.breakword,

    '&:first-child': {
      marginTop: -8,
      marginBottom: -4,
    },
  },
  users: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.main,
  },
  dateWrapper: {
    width: 80, //approx width of date to avoid text cutoff inside input field
  },
  dateAddLink: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.secondary.main,
  },
  dateInput: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    textAlign: 'center',
    fontSize: theme.typography.pxToRem(12),
  },
  info: {
    ...theme.mixins.summary.info,
  },
  boxes: {
    ...theme.mixins.summary.boxes,
  },
  tooltip: {
    fontSize: theme.typography.pxToRem(11),
  },
});

export default styles;
