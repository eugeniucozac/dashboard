const styles = (theme) => {
  const itemHeight = theme.spacing(6) + 1;
  const menuPadding = theme.spacing(2);
  const menuScrollCount = 6;
  const menuHeight = itemHeight * menuScrollCount + menuPadding;

  return {
    toolbar: {
      justifyContent: 'flex-end',
      minHeight: 0,
      padding: 0,
    },
    toolbarOverflow: {
      paddingRight: theme.spacing(3),

      [theme.breakpoints.up('sm')]: {
        paddingRight: theme.spacing(5),
      },
    },
    popover: {
      marginLeft: 12,
    },
    menu: {
      width: 300,
      maxWidth: '100%',
      maxHeight: `${menuHeight}px !important`, //approx height of menu item
    },
    name: {
      paddingTop: `${theme.spacing(1.5)}px !important`,
      paddingBottom: `${theme.spacing(1.5)}px !important`,
      paddingLeft: `${theme.spacing(2)}px !important`,
    },
    switch: {
      width: theme.spacing(6),
      padding: 0,
    },
    buttons: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: 4,
      background: 'white',
      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
      position: 'absolute',
      top: 'calc(100% + 11px)',
      left: 11,
      zIndex: 1,
    },
  };
};

export default styles;
