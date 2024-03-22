const styles = (theme) => ({
  formLabel: {
    color: theme.palette.neutral.darker,
    marginLeft: '2px',
    lineHeight: 1,
    marginBottom: '6px',
    fontFamily: 'Open Sans,Helvetica,Arial,sans-serif',
    fontSize: '0.8125rem',
    display: 'block',
  },
  inputContainer: {
    border: `1px solid ${theme.palette.neutral.medium}`,
    borderRadius: '4px',
  },
  inputLabel: {
    display: 'block',
    minHeight: '3.2em',
    lineHeight: '3.2em',
    verticalAlign: 'center',
    padding: '0px 14px',
    fontFamily: 'Open Sans,Helvetica,Arial,sans-serif',
    color: theme.palette.neutral.dark,
    fontSize: '13px',
  },
  input: {
    display: 'none',
  },
});

export default styles;
