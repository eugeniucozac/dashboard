const styles = (theme) => ({
  root: ({ media, reportExists }) => ({
    display: media.mobile ? 'none' : 'block',
    marginTop: reportExists ? -80 : 0,
    position: 'relative',
  }),
  menu: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing(5),
  },
  select: ({ media }) => ({
    maxWidth: media.desktopUp ? 240 : 160,
    marginRight: theme.spacing(2),
  }),
  powerbi: ({ reportExists }) => {
    return {
      overflow: 'hidden',
      paddingTop: reportExists ? '59%' : 0,
      position: 'relative',
      marginBottom: theme.spacing(2),
      '& iframe': {
        border: 0,
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
      },
    };
  },
});

export default styles;
