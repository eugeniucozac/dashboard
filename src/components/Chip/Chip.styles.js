import chroma from 'chroma-js';
import get from 'lodash/get';

const styles = (theme) => {
  const colorMap = {
    new: get(theme, 'palette.new.main'),
    info: get(theme, 'palette.info.main'),
    success: get(theme, 'palette.success.main'),
    alert: get(theme, 'palette.alert.main'),
    error: get(theme, 'palette.error.main'),
    light: get(theme, 'palette.grey[400]'),
    unknown: get(theme, 'palette.grey[500]'),
    pink: '#ff8699',
  };

  return {
    root: (props) => ({
      ...(props.type &&
        ['new', 'info', 'success', 'alert', 'error', 'light', 'unknown', 'pink'].includes(props.type) && {
          color: 'white',
          backgroundColor: colorMap[props.type],

          ...(props.clickable && {
            '&:hover': {
              backgroundColor: chroma(colorMap[props.type]).alpha(0.8) + '!important',
            },
          }),

          '& > svg': {
            color: 'rgba(255, 255, 255, 0.7)',

            '&:hover': {
              color: 'rgba(255, 255, 255, 1)',
            },
          },

          ...(props.variant === 'outlined' && {
            color: chroma(colorMap[props.type]).darken(0.75),
            border: `1px solid ${colorMap[props.type]}`,
            backgroundColor: 'transparent',

            ...(props.clickable && {
              '&:hover': {
                backgroundColor: chroma(colorMap[props.type]).alpha(0.1) + '!important',
              },
            }),

            '& > svg': {
              color: colorMap[props.type] + '!important',
              opacity: 0.7,

              '&:hover': {
                opacity: 1,
              },
            },
          }),
        }),

      ...(props.color === 'secondary' &&
        props.variant !== 'outlined' && {
          color: 'white',

          '& > svg': {
            color: 'rgba(255, 255, 255, 0.7)',

            '&:hover': {
              color: 'rgba(255, 255, 255, 1)',
            },
          },
        }),
    }),
  };
};

export default styles;
