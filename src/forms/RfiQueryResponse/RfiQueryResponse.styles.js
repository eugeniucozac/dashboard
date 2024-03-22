const styles = (theme, cursorPointer = 'pointer') => ({
  root: {
    ...theme.mixins.modal.dialog.root,
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
