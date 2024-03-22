const styles = (theme) => ({
  root: ({ isMobile }) => ({
    height: isMobile ? 'auto' : 36,
    marginBottom: theme.spacing(1),
  }),

  formContainer: {
    margin: 0,
    alignItems: 'stretch',
    flexDirection: 'row',
  },

  formFields: {
    flex: '1 1 auto',
  },

  fieldsContainer: ({ isMobile }) => ({
    width: '100%',
    display: 'flex',
    flexWrap: `${isMobile ? 'wrap' : 'nowrap'}`,
  }),

  fields: ({ isMobile }) => ({
    width: '100%',
    padding: '0 !important',
    margin: `0 0 ${isMobile ? '1px' : 0} ${isMobile ? 0 : '-1px'} !important`,

    '& .MuiInputBase-root': {
      borderRadius: isMobile ? 4 : 0,
    },

    '&:first-child': {
      marginLeft: '0 !important',

      '& .MuiInputBase-root': {
        borderRadius: isMobile ? 4 : '4px 0 0 4px',
      },
    },

    '&:last-child': {
      marginBottom: '0 !important',
    },

    '& fieldset': {
      borderColor: 'rgb(204,204,204) !important',
    },
  }),

  filledRoot: {
    paddingLeft: 8,

    '&:hover': {
      zIndex: 1,

      '& fieldset': {
        border: `1px ${theme.palette.neutral.darker} solid !important`,
      },
    },

    '& input:focus': {
      '& ~ fieldset': {
        zIndex: 1,
        border: `1px ${theme.palette.neutral.darker} solid !important`,
      },
    },
  },

  filledInput: {
    height: 36,
    padding: '10px',
    boxSizing: 'border-box',
  },

  resetButton: {
    height: 36,
    boxShadow: 'none',

    '&:hover': {
      boxShadow: 'none',
      backgroundColor: 'transparent ',
    },
  },

  filterButton: ({ isMobile }) => ({
    width: 90,
    height: isMobile ? '100%' : 36,
    padding: '4px 8px',
    marginLeft: isMobile ? '2px !important' : 'inherit',
    backgroundColor: theme.palette.grey[100],
    boxShadow: 'none',
    border: `1px ${theme.palette.grey[400]} solid`,
    borderLeftWidth: isMobile ? 1 : 0,
    borderRadius: isMobile ? 4 : '0 4px 4px 0',

    '&:hover': {
      backgroundColor: theme.palette.grey[200],
      boxShadow: `0 1px 1px rgba(0,0,0,.15), inset 0 0 2px rgba(0,0,0,.05);`,
      transition: `all .07s ease-in-out`,
    },
  }),

  adornmentEnd: {
    marginRight: -theme.spacing(1),
  },

  actions: {
    margin: '0 !important',
  },
});

export default styles;
