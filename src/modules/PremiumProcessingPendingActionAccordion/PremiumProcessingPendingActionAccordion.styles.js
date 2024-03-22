const styles = (theme) => ({
  description: {
    width: '50%',
    marginBottom: '20px',
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: '30px',
    '& button': {
      margin: '5px',
    },
  },
  checkbox: {
    width: '100%',
    marginTop: '0!important',
    paddingBottom: '5px!important',
    '& span': {
      fontSize: '.75rem!important',
      fontWeight: 600,
    },
  },
  caseAccordion: {
    '& h4': {
      fontSize: '.85rem',
      fontWeight: 600,
    },
  },
});

export default styles;
