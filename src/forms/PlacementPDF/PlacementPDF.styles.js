export const styles = () => ({
  printComponent: {
    position: 'absolute',
    overflow: 'hidden',
    height: 0,
    '@media print': {
      padding: 50,
      position: 'relative',
      height: 'auto',
      display: 'block',
    },
  },
});

export default styles;
