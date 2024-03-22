const styles = (theme) => ({
  root: {
    display: 'block',
  },
  listItemIcon: {
    minWidth: theme.spacing(4),
  },
  btnOffset: {
    marginTop: -4,
    marginLeft: -6,
  },
  btn: {
    padding: '0 6px',
    maxWidth: '100%',
    minHeight: 24,
    textAlign: 'left',
  },
  label: ({ size }) => {
    let fontSize;

    switch (size) {
      case 'xsmall':
        fontSize = 11;
        break;
      case 'small':
        fontSize = 12;
        break;
      case 'medium':
        fontSize = 14;
        break;
      case 'large':
        fontSize = 18;
        break;
      default:
        fontSize = 11;
        break;
    }

    return {
      maxWidth: '100%',
      textTransform: 'none',
      fontSize: theme.typography.pxToRem(fontSize),
      fontWeight: theme.typography.fontWeightRegular,

      '& > span': {
        ...theme.mixins.ellipsis,
      },
    };
  },
  tooltip: {
    marginBottom: -2,
  },
});

export default styles;
