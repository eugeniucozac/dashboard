const styles = (theme) => ({
  item: {
    display: 'flex',
    paddingTop: 3,
    paddingBottom: 3,
    lineHeight: 1.2,
  },
  name: {
    paddingRight: 2,
  },
  bullet: {
    color: theme.palette.neutral.medium,
    fontSize: theme.typography.pxToRem(12),
    verticalAlign: 'middle',
    marginTop: 2,
    marginLeft: 14,
    marginRight: 4,
    alignSelf: 'flex-start',
  },
  ellipsis: {
    flex: '1 1 auto',
    backgroundImage: `linear-gradient(to right, ${theme.palette.neutral.medium} 33%, rgba(255,255,255,0) 0%)`,
    backgroundPosition: 'left bottom 2px',
    backgroundSize: '3px 1px',
    backgroundRepeat: 'repeat-x',
  },
  amount: {
    flex: '0 0 auto',
    textAlign: 'right',
    paddingLeft: 2,
  },
});

export default styles;
