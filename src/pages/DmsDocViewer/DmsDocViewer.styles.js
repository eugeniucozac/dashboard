const styles = (theme) => ({

  defaultFrame: {
    border: `1px solid ${theme.palette.grey[300]}`,
    width: '100%',
    height: 'calc(100vh - 64px)',
    display: 'block',
  },
  imageFrame: {
    border: `1px solid ${theme.palette.grey[300]}`,
    width: '100%',
    height: 'calc(100vh - 64px)',
    display: 'block',
  },
  mediaFrame: {
    border: `1px solid ${theme.palette.grey[300]}`,
    width: '100%',
    height: 'calc(100vh - 64px)',
    display: 'block',
  },
  unSupportedDocFrame: {
    border: `1px solid ${theme.palette.grey[300]}`,
    width: 0,
    height: 0,
    display: 'none'
  }
});

export default styles;
