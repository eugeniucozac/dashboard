const styles = (theme) => ({
  root: ({ type, size, align, border, backGround, hasboxShadowColor }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    marginTop: 2,
    background: backGround ? backGround : 'transparent',
    boxShadow: hasboxShadowColor
      ? `2px 2px 3px ${
          (type === 'info' && theme.palette.info.main) ||
          (type === 'success' && theme.palette.success.main) ||
          (type === 'alert' && theme.palette.alert.main) ||
          (type === 'error' && theme.palette.error.main)
        }`
      : 'none',
    marginBottom: 2,
    color: theme.palette.neutral.main,
    fontSize: theme.typography.pxToRem(size === 'small' ? 12 : size === 'medium' ? 13 : 14),
    ...(type === 'info' && { color: theme.palette.info.main }),
    ...(type === 'success' && { color: theme.palette.success.main }),
    ...(type === 'alert' && { color: theme.palette.alert.main }),
    ...(type === 'error' && { color: theme.palette.error.main }),
    ...(border && {
      padding: `5px ${theme.spacing(1)}px 3px`,
      border: `1px solid ${
        type === 'info'
          ? theme.palette.info.light
          : type === 'success'
          ? theme.palette.success.light
          : type === 'alert'
          ? theme.palette.alert.light
          : type === 'error'
          ? theme.palette.error.light
          : theme.palette.neutral.medium
      }`,
      borderRadius: theme.shape.borderRadius,
    }),
  }),
  icon: ({ size }) => ({
    fontSize: theme.typography.pxToRem(size === 'small' ? 16 : size === 'medium' ? 18 : 20),
    marginRight: 4,
  }),
});

export default styles;
