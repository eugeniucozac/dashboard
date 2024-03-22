const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  title: ({ textAlign }) => ({
    marginRight: theme.spacing(1),
    width: '30%',
    color: 'rgba(0, 0, 0, 0.87)!important',
    textAlign: textAlign,
  }),
  details: {
    marginLeft: theme.spacing(1),
    width: '70%',
    color: 'inherit!important',
  },
  link: {
    marginLeft: theme.spacing(1),
  },
});

export default styles;
