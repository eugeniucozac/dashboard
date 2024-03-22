const styles = (theme) => ({
  hover: {
    cursor: 'pointer',
  },
  selectedRow: {
    background: theme.palette.grey[100],
  },
  logo: {
    display: 'block',
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: 20,
  },
  logoCell: {
    width: '10%',
    minWidth: 80,
  },
  officeCell: {
    width: '50%',
  },
});

export default styles;
