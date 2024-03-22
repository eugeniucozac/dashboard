const styles = (theme) => ({
  teamCaseList: {
    paddingTop: theme.spacing(1),
    minWidth: '200px',
    width: '30%',
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: theme.spacing(1),
  },
  apiFetchErrorIcon: {
    color: theme.palette.error.light,
  },
});

export default styles;
