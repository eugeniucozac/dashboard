const styles = (theme) => ({
  summaryContainer: {
    position: 'relative',
    height: 60,
  },
  info: {
    ...theme.mixins.summary.info,
    minWidth: 'auto',
  },
  infoContent: {
    minWidth: 'auto!important',
  },
  headerInfo: {
    margin: 0,
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 32,
    overflow: 'hidden',
  },
  boxes: {
    ...theme.mixins.summary.boxes,
    width: 'auto!important',
  },
  boxesEmpty: {
    ...theme.mixins.summary.boxesEmpty,
  },
  headerBoxes: {
    alignItems: 'center',
    marginLeft: theme.spacing(3),
    width: 'auto!important',
  },
  clients: {
    display: 'block',
    marginTop: 2,
    marginBottom: 6,
    lineHeight: 1.1,

    '&:last-child': {
      marginBottom: 0,
    },
  },
  accordion: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > div': {
      width: 'calc(50% - 20px)',
    },
  },
});

export default styles;
