const styles = (theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: '14px',
  },
  labelWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
  },
  iconDefault: {
    color: theme.palette.neutral.main,
  },
  iconPrimary: {
    color: '#ffc107',
  },
  label: {
    flex: '1 1 auto',
  },
  sublabel: {
    flex: '1 1 100%',
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.medium,
    marginLeft: theme.spacing(1),
  },
});

export default styles;
