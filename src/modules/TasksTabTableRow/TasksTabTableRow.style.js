const styles = (theme) => ({
    row: {
      cursor: 'pointer',
  
      '&.active': {
        backgroundColor: theme.palette.grey[300],
      },
    },
    rowSelected: {
      background: theme.palette.grey[100],
    },
    checkbox: {
      padding: '0 !important',
    },
    rejected: {
      color: theme.palette.error.main,
    },
    description: {
      minWidth: theme.spacing(26),
    },
    dateAlert: {
      color: theme.palette.error.main,
    },
    modalTitle: {
      paddingLeft: theme.spacing(3)
    },
    taskRefSpacing: {
      paddingLeft: theme.spacing(4)
    }
  });
  
  export default styles;
  