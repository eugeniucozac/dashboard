const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(1.5),

    '&:first-child': {
      marginTop: 0,
    },

    '&:last-child': {
      paddingBottom: 0,
    },
  },
  formLabel: {
    color: theme.palette.neutral.darker,
    marginLeft: '2px',
    lineHeight: 1,
    marginBottom: '6px',
    fontSize: theme.typography.pxToRem(13),
    display: 'block',
  },
  dragArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    borderWidth: 1,
    borderRadius: 2,
    borderColor: theme.palette.grey[200],
    borderStyle: 'dashed',
    background: theme.palette.grey[50],
    color: theme.palette.grey[500],
    fontSize: theme.typography.pxToRem(14),
    outline: 'none',
    transition: theme.transitions.create(['border']),

    '&:hover': {
      cursor: 'pointer',
    },
  },
  or: {
    margin: 0,
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.grey[400],
  },
  uploadedFileList: {
    marginTop: theme.spacing(3),
    listStyle: 'none',
    padding: 0,
    fontSize: theme.typography.pxToRem(13),
    width: 'max-content',

    '& > li': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  browseFile: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.grey[600],
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 3,
    backgroundColor: 'transparent',
    transition: theme.transitions.create(['color', 'border', 'background-color'], {
      duration: theme.transitions.duration.shorter,
    }),

    '&:hover': {
      color: theme.palette.grey[700],
      borderColor: theme.palette.grey[700],
      backgroundColor: theme.palette.neutral.lightest,
    },
  },
  dragFile: {
    margin: '2px 0 10px',
    textAlign: 'center',
  },
  uploadIcon: {
    fontSize: theme.typography.pxToRem(36),
    color: theme.palette.grey[400],
  },
  successIcon: {
    color: theme.palette.success.main,
    fontSize: theme.typography.pxToRem(20),
    marginRight: 5,
  },
  uploadedFileListLabel: {
    display: 'flex',
    flexWrap: 'no-wrap',
    alignItems: 'center',
    maxHeight: '24px',
  },
  uploadedFileListItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  errorIcon: {
    color: theme.palette.error.main,
    fontSize: theme.typography.pxToRem(20),
    marginRight: 5,
  },
});

export default styles;
