import * as utils from 'utils';
import chroma from 'chroma-js';

const borderSize = 2;

const styles = (theme) => {
  const getBgColor = ({ text, icon, src, bg }) => {
    if (bg) {
      return bg;
    } else if (text) {
      return utils.color.random(text);
    } else if (icon) {
      return 'white';
    } else if (src) {
      return 'transparent';
    } else {
      return theme.palette.grey[300];
    }
  };

  const hasBorder = (props) => {
    const bgColor = getBgColor(props);
    return chroma(bgColor === 'transparent' ? theme.palette.grey[300] : bgColor).darken(0.75);
  };

  return {
    root: (props) => {
      return {
        width: props.hasAction ? props.size - borderSize * 2 : props.size,
        height: props.hasAction ? props.size - borderSize * 2 : props.size,
        fontSize: `${(props.size / 24) * 0.6875}rem`,
        ...(!!props.icon && { color: theme.palette.text.primary }),
        textTransform: 'uppercase',
        backgroundColor: getBgColor(props),
        boxSizing: 'content-box',
        border: props.hasAction ? `${borderSize}px solid transparent` : 'none',
        cursor: props.hasAction ? 'pointer' : 'default',

        '&:hover': {
          borderColor: props.hasAction ? hasBorder(props) : 'transparent',
        },

        '&:before': {
          display: props.border ? 'block' : 'none',
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
          border: props.border === true ? `1px solid ${theme.palette.neutral.main}` : props.border,
          borderRadius: props.variant === 'rounded' ? 4 : props.variant === 'square' ? 0 : '50%',
          zIndex: 1,
          boxSizing: 'border-box',
        },
      };
    },
  };
};

export default styles;
