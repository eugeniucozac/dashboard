const styles = (theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: '14px',
    width: '100%',
  },
  labelWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    color: theme.palette.neutral.main,
  },
  label: {
    flex: '1 1 auto',
    paddingRight: theme.spacing(1),
  },
  sublabel: {
    flex: '1 1 100%',
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.medium,
    padding: `0 ${theme.spacing(1)}px`,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

export default styles;
