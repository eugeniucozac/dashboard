const styles = (theme) => ({
  inputRoot: ({ multiple }) => {
    return {
      ...(multiple && {
        paddingTop: '8px !important',
        paddingBottom: '4px !important',
      }),
    };
  },
  input: ({ multiple }) => {
    return {
      ...(multiple && {
        marginTop: -4,
        marginBottom: -2,
        paddingTop: '9.5px !important',
        paddingBottom: '9.5px !important',
      }),
    };
  },
  chip: {
    borderRadius: '2px !important',
  },
});

export default styles;
