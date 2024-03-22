import defaults from './theme-defaults';
import mixins from './theme-mixins';
import overrides from './theme-overrides';
import props from './theme-props';

const { palette, shape, shadows, typography, width, zIndex } = defaults;

const theme = {
  mixins: { ...mixins },
  overrides: { ...overrides },
  palette: { ...palette },
  props: { ...props },
  shadows: [...shadows],
  shape: { ...shape },
  typography: { ...typography },
  width: { ...width },
  zIndex: { ...zIndex },
};

export default theme;
