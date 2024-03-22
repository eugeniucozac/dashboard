const styles = (theme, cursorPointer = 'pointer') => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  formStyling: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      overflowY: 'auto',
    },
  },
  toggleButtonStyling: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0',
    padding: '0.3rem',
  },
  formFieldsStyling: {
    [theme.breakpoints.up('md')]: {
      flex: '1 1 30.3333%',
      padding: '0.5rem',
    },
  },
  responseRootStyling: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      overflowY: 'auto',
    },
  },
  responseFieldStyling: {
    flex: '1 0',
    padding: '0.2rem',
  },
  attachIconStyling: {
    padding: '0.2rem',
    marginTop: '4rem',
  },
  headingStyling: {
    fontWeight: 600,
  },
  docStyle: {
    cursor: cursorPointer,
  },
  selectedDocStyle: {
    cursor: cursorPointer,
    backgroundColor: '#747d90',
    color: 'white',
  },
  iconNormal: {
    color: 'primary',
    fontSize: '3rem',
  },
  iconSelected: {
    color: 'white',
    fontSize: '3rem',
  },
  viewDocument: {
    fontSize: '11.5px',
    color: 'blue',
  },
  addDocument: {
    color: 'blue',
    fontSize: '11.5px',
  },
});

export default styles;
