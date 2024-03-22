const styles = (theme) => ({
  // replicate MapBox buttons
  root: {
    width: 30,
    height: 31,
    padding: 0,
    color: '#333',
    outline: 'none',
    border: 'none',
    borderBottom: '1px solid #ddd !important',
    borderRadius: 0,
    boxSizing: 'border-box',
    boxShadow: 'none !important',
    backgroundColor: (props) => (props.selected ? theme.palette.neutral.light : 'rgba(0, 0, 0, 0)'),
    cursor: 'pointer',

    '&:last-child': {
      borderBottom: 0,
      height: 30,
    },

    '&:hover': {
      backgroundColor: theme.palette.neutral.lighter,
    },

    '&:disabled': {
      color: 'rgba(0, 0, 0, 0.5)',
      opacity: 0.5,
    },
  },
});

export default styles;
