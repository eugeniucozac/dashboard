const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  singleLine: {
    alignSelf: 'center',
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  isLink: {
    cursor: 'pointer',
  },
  avatarXs: {
    marginRight: theme.spacing(0.75),
  },
  avatarSm: {
    marginRight: theme.spacing(1),
  },
  avatarMd: {
    marginRight: theme.spacing(1.25),
  },
  avatarLg: {
    marginRight: theme.spacing(1.5),
  },
  avatarXl: {
    marginRight: theme.spacing(1.5),
  },
  content: {
    minWidth: 100,
  },
  title: {
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium,
    marginTop: '-1px !important',
    ...theme.mixins.breakword,
  },
  subtitle: {
    display: 'inline-block',
    marginLeft: theme.spacing(1),
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.main,
    ...theme.mixins.breakword,
  },
  description: {
    marginTop: 0,
    ...theme.mixins.breakword,
  },
  ellipsis: {
    minWidth: 0,
  },
  textFontSizeXs: {
    fontSize: theme.typography.pxToRem(11),
  },
  textFontSizeSm: {
    fontSize: theme.typography.pxToRem(12),
  },
  textFontSizeMd: {
    fontSize: theme.typography.pxToRem(13),
  },
  textFontSizeLg: {
    fontSize: theme.typography.pxToRem(14),
  },
  textFontSizeXl: {
    fontSize: theme.typography.pxToRem(16),
  },
  subtitleFontSizeXs: {
    fontSize: theme.typography.pxToRem(10),
  },
  subtitleFontSizeSm: {
    fontSize: theme.typography.pxToRem(11),
  },
  subtitleFontSizeMd: {
    fontSize: theme.typography.pxToRem(11),
  },
  subtitleFontSizeLg: {
    fontSize: theme.typography.pxToRem(11),
  },
  subtitleFontSizeXl: {
    fontSize: theme.typography.pxToRem(12),
  },
});

export default styles;
