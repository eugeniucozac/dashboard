const styles = (theme) => ({
  radio: (props) => ({
    marginRight: 2,
    marginLeft: 5,
    padding: 6,
    borderRadius: '50%',
  }),
  radioGroup: {
    marginTop: theme.spacing(2),
    paddingBottom: 10,

    '&:first-child': {
      marginTop: 0,
    },
  },
  groupTitle: (props) => ({
    marginBottom: theme.spacing(0.5),
    ...(props.hasError && { color: theme.palette.error.main }),
  }),
});

export default styles;
