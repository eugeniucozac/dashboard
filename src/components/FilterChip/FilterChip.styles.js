const styles = (theme) => ({
  chip: ({ remove, focus }) => ({
    margin: 0,
    marginLeft: -6,
    marginRight: 12,
    marginBottom: 4,
    maxWidth: '95%',
    height: theme.spacing(3.5),
    lineHeight: `${theme.spacing(3.5)}px`,
    backgroundColor: focus ? theme.palette.grey[300] : theme.palette.neutral.lighter,
    border: `1px solid ${theme.palette.neutral.light}`,
    borderRadius: 4,
    fontSize: theme.typography.pxToRem(11),

    '& > span:first-child': {
      display: 'block',
      width: '100%',
      paddingLeft: 10,
      paddingRight: remove ? 14 : 10,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },

    '& > svg': {
      width: theme.spacing(2),
      marginRight: 4,
    },
  }),
});

export default styles;
