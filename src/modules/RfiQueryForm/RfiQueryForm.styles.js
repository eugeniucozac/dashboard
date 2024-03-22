const styles = (theme) => ({
  root: {
    width: '100%',
    boxShadow: 'none',
  },
  sectionheader: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  fullWidth: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > div:last-child': {
      padding: theme.spacing(0),
    },
  },
  catCodeSelect: {
    '& .MuiBox-root': {
      overflow: 'hidden',
    },
  },
  descriptionBox: {
    '& > div:first-child': {
      paddingRight: theme.spacing(0),
    },
  },
  docsPromptGrid: {
    marginLeft: theme.spacing(4),
  },
  uploadYesBtn: {
    marginLeft: theme.spacing(1),
  },
  submitDocsBtn: {
    margin: '0 auto',
  },
  replyBtnContainer: {
    justifyContent: 'flex-end',
    paddingLeft: '2rem',
    paddingRight: '1rem',
  },
  closeBtn: {
    marginLeft: '12px',
  },
  attachedDocumentContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 20%)',
    marginBottom: theme.spacing(1),
    width: '93%'
  },
  expandBtn: {
    paddingTop: theme.spacing(1),
  },
  collapseBtn: {
    position: 'relative',
    '& a': {
      position: 'absolute',
      bottom: theme.spacing(1.5),
      whiteSpace: 'nowrap'
    },
  },
});

export default styles;
