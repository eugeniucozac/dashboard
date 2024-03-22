const styles = (theme) => ({
  formLabel: {
    fontSize: theme.typography.pxToRem(13),
    marginBottom: 6,
    marginLeft: 2,
  },
  formInput: {
    '& input': {
      paddingTop: '9.5px',
      paddingBottom: '7.5px',
      height: '28px',
    },
  },
  radioLabel: {
    marginTop: '0px !important',

    '& label span:last-of-type': {
      fontWeight: 600,
      fontSize: '0.75rem!important',
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
  },
  accordionTitle: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  accordionContent: {
    width: '100%',
    borderTop: `1px dotted ${theme.palette.neutral.light}`,
  },
});

export default styles;
