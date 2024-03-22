const styles = (theme) => ({
  root: {},
  name: {
    minWidth: 300,
    maxWidth: 220,
  },
  details: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    maxWidth: '100%',
  },
  checkbox: {
    flex: '0 0 auto',
    margin: '0 -2px 0 -12px',
  },
  layer: {
    flex: '0 1 auto',
  },
  notes: {
    flex: '1 1 auto',
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: theme.spacing(1),
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.medium,
    lineHeight: 1.43,
    ...theme.mixins.ellipsis,
  },
  notesWithContent: {
    minWidth: 50,
  },
  status: {
    flex: '0 1 auto',
    marginLeft: theme.spacing(1),
  },
  row: {
    height: 42,
    lineHeight: 1,
    cursor: 'pointer',
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),

    '&& > :first-child': {
      paddingLeft: theme.spacing(3),
    },
  },
  rowSelected: {
    backgroundColor: theme.palette.grey[50],
  },
  rowNextSelected: {
    '& > th, & > td': {
      borderBottomColor: '#ccc',
    },
  },
});

export default styles;
