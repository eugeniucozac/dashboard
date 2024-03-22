const styles = (theme) => ({
  container: {
    overflowY: 'auto',
    paddingLeft: 32,
    paddingRight: 32,
  },
  dateTimeLabel: {
    fontSize: theme.typography.pxToRem(13),
    lineHeight: theme.typography.pxToRem(13),
    margin: '0 0 10px 2px',
  },
  time: {
    flex: '1 1 100%',
    marginRight: 12,
  },
  timeField: {
    display: 'flex',
    alignItems: 'center',
  },
  timeInput: {
    paddingLeft: 12,
    paddingRight: 12,
    textAlign: 'center',

    '&::-webkit-calendar-picker-indicator': {
      display: 'block',
    },
  },
  timeIcon: {
    display: 'block',
  },
  warningMessage: {
    marginTop: -4,
  },
  warningMessageDate: {
    marginTop: -4,
    marginLeft: theme.spacing(1),
  },
});

export default styles;
