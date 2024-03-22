const styles = (theme) => ({
  businessName: {
    marginBottom: 30,
    paddingBottom: 5,
    borderBottom: `1px solid ${theme.palette.neutral.light}`,
  },

  mudmapRotate: {
    width: '240mm',
    paddingRight: '40mm',
  },

  mudmapContainer: {
    transform: 'rotate(-90deg)',
    width: '200mm',
    top: '30mm',
    position: 'relative',
  },

  chartKey: {
    margin: '20px 0 0',
  },
});

export default styles;
