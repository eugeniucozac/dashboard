const styles = (theme) => ({
  root: {
    width: '100%',
  },
  tabs: {
    position: 'relative',
    border: 'none',
  },
  tabsWrap: {
    flexWrap: 'wrap',
  },
  title: {
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(10),
    letterSpacing: 0.1,
  },
  card: {
    flex: (props) => (props.scrollable ? '0 0 auto' : '0 1 auto'),
    marginRight: 4,
    marginBottom: 4,
  },
});

export default styles;
