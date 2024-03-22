const styles = (theme) => ({
  title: {
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: 12,
  },
  item: {
    display: 'flex',
    marginBottom: 10,

    '&:last-child': {
      marginBottom: 0,
    },
  },
  itemIcon: {
    flex: '0 0 auto',

    '& > svg': {
      color: theme.palette.grey[500],
      marginRight: 4,
      marginLeft: -4,
      fontSize: theme.typography.pxToRem(18),
    },
  },
  itemDetails: {
    flex: '1 1 auto',
  },
  itemTitle: {
    alignSelf: 'center',
    flex: '1 1 auto',
    margin: 0,
  },
  itemContent: {
    width: '100%',
    marginTop: 6,
    fontSize: theme.typography.pxToRem(11),
  },
});

export default styles;
