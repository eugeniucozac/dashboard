const styles = (theme) => ({
  root: {
    color: theme.palette.common.white,
    height: 24,
    lineHeight: 1.5,
  },
  rootXxs: {
    height: 14,
    lineHeight: '14px',
    fontSize: theme.typography.pxToRem(9),
  },
  rootXs: {
    height: 17,
    lineHeight: '17px',
    fontSize: theme.typography.pxToRem(10),
  },
  rootSm: {
    height: 20,
    fontSize: theme.typography.pxToRem(12),
  },
  rootMd: {},
  rootLg: {
    height: 28,
    fontSize: theme.typography.pxToRem(14),
  },
  rootXl: {
    height: 32,
    fontSize: theme.typography.pxToRem(15),
  },
  labelXxs: {
    paddingLeft: 6,
    paddingRight: 6,
  },
  labelXs: {
    paddingLeft: 6,
    paddingRight: 6,
  },
  labelSm: {},
  labelMd: {},
  labelLg: {},
  labelXl: {},
});

export default styles;
