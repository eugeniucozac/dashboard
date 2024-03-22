const styles = (theme) => ({
  description: {
    width: '50%',
    marginBottom: theme.spacing(2.25),
  },
  info: {
    paddingLeft: theme.spacing(4),
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  caseAccordion: {
    '& h4': {
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
});

export default styles;
