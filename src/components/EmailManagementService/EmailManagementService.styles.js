const styles = (theme) => ({
  goBackButton: {
    marginRight: theme.spacing(2),
  },
  sendButton: {
    height: theme.spacing(7.5),
    textTransform: 'none',
  },
  input: {
    marginTop: '0px !important',
    height: theme.spacing(3.12),
  },
  sendLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItem: 'center',
  },
  sendIcon: {
    marginRight: '0px !important',
  },
  gridBorder: {
    border: `1px solid  ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    height: theme.spacing(48),
  },
  mailBodyFileUploadDragArea: {
    height: 60,
    padding: '0px !important',
  },
  mailListHeader1: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightMedium,
  },
  mailListHeader2: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightRegular,
  },
  mailListHeader3: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.grey[600],
  },
  mailList: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    borderBottom: `1px solid  ${theme.palette.grey[300]}`,
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.neutral.lighter,
    },
  },
  mailBodyButton: {
    color: 'black',
    backgroundColor: 'white !important',
    border: `1px solid  ${theme.palette.grey[500]} !important`,
    marginRight: theme.spacing(3),
  },
  mailBodySubject: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightMedium,
  },
  mailBody: {
    overflow: 'auto',
    maxHeight: 220,
  },
  mailBodyToCc: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.grey[600],
  },
  mailInboxContainer: {
    borderRight: `1px solid  ${theme.palette.grey[300]}`,
    height: theme.spacing(47.8),
  },
  mailListBody: {
    overflow: 'auto',
    height: '90%',
  },
  mailSelected: {
    background: theme.palette.neutral.light,
  },
  date: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightRegular,
    textAlign: 'right',
  },
  fullWidth: {
    width: '100%',
  },
  composeMailForm: {
    marginTop: '0px !important',
  },
  attachment: {
    border: `1px solid  ${theme.palette.grey[300]}`,
    borderRadius: 4,
    padding: theme.spacing(1),
    textAlign: 'center',
  },
  attachedDocumentsContainer: {
    maxHeight: 56,
    overflow: 'auto',
  },
});
export default styles;
