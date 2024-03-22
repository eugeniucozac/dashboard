const styles = (theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flex: '1',
  },
  cardHeader: {
    alignItems: 'flex-start',
  },
  noMedia: {
    position: 'relative',
    height: 140,
    background: '#40ceae',
    color: '#fff',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMediaText: {
    fontSize: theme.typography.pxToRem(16),
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
  noMediaIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  media: {
    height: 140,
    backgroundPosition: 'center',
    backgroundSize: '100%',
  },
  linkRoot: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightMedium,
    padding: '5px 7px',
  },
  linkIcon: {
    margin: '0 5px',
    fontSize: 12,
  },
});

export default styles;
