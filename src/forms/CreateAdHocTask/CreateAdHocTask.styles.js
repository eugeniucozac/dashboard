const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  textFieldTime: {
    width: '100%',
  },
  'input[type="date"]': {
    textTransform: 'uppercase',
  },
  datepicker: {
    '& > div': {
      color: theme.palette.neutral.dark,
    },
    '& label': {
      fontWeight: theme.typography.fontWeightMedium,
      color: "rgba(0, 0, 0, 0.87) !important",
      fontSize: theme.typography.pxToRem(12)
    }
  },
  catCodeSelect: {
    '& .MuiBox-root': {
      overflow: 'hidden',
    },
  },
  greyGrid: {
    margin: theme.spacing(1.75,1) ,
    padding: theme.spacing(2) ,
    backgroundColor: theme.palette.grey[100],
    display:"flex",
    width:"100%",
    justifyContent:"space-evenly"
  },
  assignees: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  sectionheader: {
    marginBottom: theme.spacing(3),
    fontWeight: theme.typography.fontWeightMedium,
  },
  assigneeItem: {
    marginTop: theme.spacing(1),
  },
  uploadYesBtn: {
    marginLeft: theme.spacing(1),
  },
  dmsView: {
    padding: theme.spacing(4),
  },

  newLabel: {
    '& label': {
      fontWeight: theme.typography.fontWeightMedium,
      color: "rgba(0, 0, 0, 0.87) !important",
      fontSize: theme.typography.pxToRem(12)
    }
  }
});

export default styles;
