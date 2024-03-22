const styles = (theme) => ({
  root: {
    boxShadow: 'none',
    border: `${theme.spacing(0.5)}px solid ${theme.palette.grey[500]}`,
    borderRadius: theme.spacing(0),
  },
  cardHeader: {
    padding: theme.spacing(0),
    background: theme.palette.grey[500],
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: theme.spacing(1),
  },
  title: {
    marginTop: theme.spacing(6),
    padding: theme.spacing(1.5),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  nextActionBtn: {
    marginRight: theme.spacing(1.5),
    '& button': {
      background: theme.palette.common.white,
      '&:hover': {
        background: theme.palette.common.white,
      },
    },
  },
  mandatoryHint: {
    padding: theme.spacing(2.5, 2.5, 1.5),
    '& p': {
      fontStyle: 'italic',
      color: `${theme.palette.info.dark} !important`,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  noCheckListWarning: {
    padding: theme.spacing(2.5, 2.5, 1.5),
    minWidth: theme.spacing(37.5),
    margin: '0 auto',
    '& p': {
      fontStyle: 'italic',
      color: `${theme.palette.info.dark} !important`,
      fontWeight: theme.typography.fontWeightBold,
    },
  },

  formContainer: {
    margin: 0,
  },
  tableContainer: {
    maxHeight: theme.spacing(55),
    padding: theme.spacing(1, 2),
  },
  tableHead: {
    position: 'sticky',
    background: theme.palette.common.white,
    zIndex: 10,
    top: theme.spacing(-1),
    '& th': {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.pxToRem(12),
    },
    '& th:first-child': {
      width: theme.spacing(2.5),
    },
  },
  tableCell: {
    width: theme.spacing(10.6),
    position: 'relative',
  },
  checkBoxCell: {
    maxWidth: theme.spacing(2.5),
    position: 'relative',
  },
  actionDescCell: {
    width: theme.spacing(40),
    position: 'relative',
  },
  checklistActionBtns: {
    margin: theme.spacing(1),
  },
});

export default styles;
