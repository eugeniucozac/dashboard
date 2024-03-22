const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
    borderTop: (props) => (props.divider ? `1px dashed ${theme.palette.neutral.light}` : 0),
  },
  toggle: {
    padding: '1px 6px',
    margin: `-3px 4px -2px`,
    minWidth: 0,
    minHeight: 20,
    height: 'auto',
    lineHeight: 'inherit',
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'normal',
  },
  label: {
    textTransform: 'none',
    textDecoration: 'underline',
    fontSize: theme.typography.pxToRem(11),
  },
  title: {
    marginTop: (props) => (props.divider ? `${theme.spacing(2.5)}px !important` : '8px !important'),
    marginBottom: -6,
  },
  info: {
    '&&': {
      marginBottom: theme.spacing(2),

      '&:first-child': {
        marginTop: theme.spacing(3),
      },

      '&:last-child': {
        marginBottom: 0,
      },
    },
  },
  form: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  avatar: {
    marginTop: 2,
    marginRight: theme.spacing(1),
  },
  input: {
    flex: 1,
    margin: theme.spacing(0, 1, 0, 0),
    padding: 0,

    '& > div': {
      paddingTop: 9.5,
      paddingBottom: 7.5,
    },

    '& > div > textarea:empty:first-child': {
      height: '19px !important',
      ...theme.mixins.ellipsis,
    },
  },
  submit: {
    flex: 0,
  },
});

export default styles;
