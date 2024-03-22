const styles = (theme) => ({
  statusContainer: {
    display: 'flex',
    whiteSpace: 'nowrap',
  },
  approvalContainer: {
    display: 'flex',
  },
  approvalCell: {
    height: 22,
  },
  approvalChild: {
    padding: '0.2rem',
  },
  filterIcon: {
    paddingBottom: '0!important',
    marginLeft: 20,
    minHeight: 'auto',
  },
  statusChip: {
    marginRight: 10,
    marginTop: 2,
    width: 130,
  },
  statusInProgress: {
    color: theme.palette.neutral.lighter,
  },
  statusApproved: {
    color: theme.palette.success.main,
  },
  downloadColumn: {
    width: 20,
  },
});

export default styles;
