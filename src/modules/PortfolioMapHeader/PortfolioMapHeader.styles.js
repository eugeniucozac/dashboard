const styles = (theme) => ({
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    minHeight: 36,
    marginTop: -4,
    marginRight: 20,
    marginBottom: -4,

    '& img': {
      display: 'block',
      maxWidth: 120,
      maxHeight: 36,
    },
  },
  card: {
    marginRight: 4,
  },
  filterModal: {
    marginRight: theme.spacing(5),
    maxWidth: '100%',
  },
  title: {
    marginBottom: 0,
    lineHeight: '36px',
  },
});

export default styles;
