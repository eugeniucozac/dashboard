const styles = (theme) => ({
  textFieldTime: {
    width: '100%',
  },
  'input[type="date"]': {
    textTransform: 'uppercase',
  },
  datepicker: {
    '& > div': {
      color: theme.palette.neutral.dark,
    },
  },
  catCodeSelect: {
    '& .MuiBox-root': {
      overflow: 'hidden',
    },
  },
  dmsView: {
    padding: theme.spacing(4),
  },
});

export default styles;
