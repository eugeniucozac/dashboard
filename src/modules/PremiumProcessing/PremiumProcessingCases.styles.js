const styles = (theme) => ({
  row: {
    cursor: 'pointer',
  },
  rowSelected: {
    background: theme.palette.grey[100],
  },
  selectBtn: {
    minWidth: '10px !important',
    minHeight: '10px !important',
    padding: '0 !important',
    margin: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),

    '&:hover': {
      color: theme.palette.neutral.main,
    },
    color: theme.palette.neutral.medium,
  },
  selectIcon: {
    display: 'flex',
    fontSize: theme.typography.pxToRem(16),
    color: 'inherit',
  },
  filterIcon: {
    fontSize: theme.typography.pxToRem(24),
  },
  cellCheckbox: {
    paddingLeft: '0 !important',
  },
  qcFlag: {
    background: theme.palette.primary.main,
    color: 'white',
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  rfiFlag: {
    background: theme.palette.primary.main,
    color: 'white',
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  rpFlag: {
    background: theme.palette.error.light,
    color: 'white',
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  rsFlag: {
    background: theme.palette.error.light,
    color: 'white',
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  subText: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.main,
  },
  subTextError: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.error.main,
  },
  casesFilter: {
    cursor: 'pointer',
  },
  casesSort: {
    cursor: 'pointer',
  },
  relativeBox: {
    position: 'relative',
  },
  announcementIconStyling: {
    cursor: 'pointer',
    position: 'absolute',
    top: '-.4rem',
    right: '-1.5rem',
  },
  wrapText: {
    maxWidth: '6vw !important',
    ...theme.mixins.ellipsis,

    '&:last-child': {
      paddingRight: '16px !important',
    },
  },
  progressBox: {
    border: `1px solid ${theme.palette.neutral['lighter']}`,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  chips: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    margin: theme.spacing(1),
  },
  progressReportCountPieChart: {
    margin: theme.spacing(4),
  },
  totalCasesReport: {
    padding: theme.spacing(4),
    borderRight: `1px solid ${theme.palette.neutral['lighter']}`,
  },
  totalCasesText: {
    fontSize: theme.spacing(3),
    color: theme.palette.primary['light'],
    fontWeight: 400,
  },
  totalCasesCount: {
    fontSize: theme.spacing(4.5),
    color: theme.palette.primary['dark'],
    fontWeight: theme.typography.fontWeightMedium,
  },
  tinyLegend: {
    width: theme.spacing(1),
    height: theme.spacing(1),
  },
  columnsPopover: {
    maxHeight: 'calc(100% - 32px)',
    display: 'flex',
    flexDirection: 'column',
    width: 240,
    padding: theme.spacing(2),
  },
  btn: {
    padding: '0 6px',
    maxWidth: '100%',
    minHeight: 24,
    textAlign: 'left',
    textTransform: 'none',
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightRegular,
  },
  assignToCell: {
    display: 'flex',
    fontSize: theme.typography.pxToRem(12),
  },
  assignedToAlignment: {
    float: 'left',
  },

  title: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightMedium,
  },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(12),
    margin: `${theme.spacing(1, 0)} !important`,
  },
  subTitle1: {
    fontSize: theme.typography.pxToRem(12),
    margin: `${theme.spacing(1, 0)} !important`,
    paddingLeft: theme.spacing(0.1),
  },
  gridMultiSelect: {
    marginTop: theme.spacing(1.95),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: theme.typography.pxToRem(14),
  },

  bulkAssignPopover: {
    border: `1px solid ${theme.palette.neutral['lighter']}`,
    borderRadius: '5px',
    width: theme.spacing(1),
  },
  switchControl: {
    marginTop: theme.spacing(-0.5),
    marginLeft: theme.spacing(2),
  },
  noLeftMargin: {
    marginLeft: 0,
  },
  tableHeaderCheckbox: {
    top: '12px',
    left: -4,
    margin: 10,
    height: 20,
    width: 20,
  },
  tableToolbar: {
    alignItems: 'center !important',
  },
  pageRow: {
    flex: '1 0 0',
    marginTop: '-15px',
  },
  fieldWidth: {
    width: `150px !important`,
  },
  popoverFrame: {
    maxHeight: 'calc(100% - 40px)',
    display: 'flex',
    flexDirection: 'row',
    width: '500px',
    padding: theme.spacing(2),
  },
  searchPopoverFrame: {
    maxHeight: 'calc(100% - 40px)',
    display: 'flex',
    flexDirection: 'row',
    width: '500px',
  },
  datePickerLabel: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 'auto',
  },
  datePickerInput: {
    textAlign: 'right',
  },
  searchBox: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: theme.spacing(8.5),
    marginBottom: theme.spacing(-3.6),
  },
  searchflex: {
    flex: 0.4,
  },
  searchContainer: {
    margin: theme.spacing(1),
    flex: '1',
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeStyle: {
    width: '0.8rem',
  },
  infoStyle: {
    width: '1.5rem',
  },
  flags: {
    marginRight: theme.spacing(0.5),
  },
});

export default styles;
