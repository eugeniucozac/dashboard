const styles = (theme) => ({
  iconWrapper: {
    display: 'inline',
    whiteSpace: 'nowrap',
  },
  iconHoverRegular: {
    '&:hover + span': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  iconHoverMedium: {
    '&:hover + span': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
  icon: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.alert.main,
    marginTop: 2,
    marginRight: -1,
    verticalAlign: 'text-top',
  },
});

export default styles;
