const styles = (theme) => ({
  placeholder: {
    color: 'rgba(0,0,0,0.35)',
  },
  disabled: {
    color: theme.palette.neutral.medium,
  },
  createIcon: {
    width: 20,
    height: 20,
    margin: '-1px 4px -1px -4px',
  },
  selectedLabel: {
    display: 'block',
    ...theme.mixins.ellipsis,
  },
  createLabel: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  select: {
    minWidth: 160,
  },
  selectMd: {
    paddingTop: 12.5,
    paddingBottom: 12.5,
  },
  selectSm: {
    paddingTop: 9.5,
    paddingBottom: 7.5,
  },
  selectXs: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  iconXs: {
    paddingTop: 4,
    right: 4,
    paddingBottom: 4,
  },
});

export default styles;
