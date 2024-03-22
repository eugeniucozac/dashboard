const styles = (theme) => ({
  geocoding: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  geocodingText: {
    marginRight: theme.spacing(1.5),
  },
  geocodingLink: {
    color: theme.palette.secondary.main,
    cursor: 'pointer',
  },
});

export default styles;
