import chroma from 'chroma-js';
import config from 'config';
import isNumber from 'lodash/isNumber';
import randomcolor from 'randomcolor';

const utilsColor = {
  /**
   * Return an array of colors, or a single color from that array if in index is provided.
   * @param {number} [count=128] The number of color to create in the array.
   * @param {Boolean} trim Trim x colors from each end of the array.
   * @param {number|null} index The specific index to return.
   * @param {Array} colors The array of colors from which to create the color scale.
   * @param {Boolean} correctLightness To apply or not Chroma correctLightness.
   * @param {Boolean} bezierInterpolation To apply or not Chroma bezierInterpolation.
   * @param {string} mode Color mode to use.
   * @returns {(string|Array)}
   */
  scale: (
    count = 128,
    trim = true,
    index,
    colors = config.ui.chart.colours.default,
    correctLightness = false,
    bezierInterpolation = true,
    mode = 'lab'
  ) => {
    const colorCount = parseInt(count);
    let colorScale;
    let colorArray;
    const hasIndex = isNumber(index) && index >= 0;
    const colorIndex = hasIndex && parseInt(index);

    if (bezierInterpolation) {
      colorScale = chroma.bezier(colors).scale();
    } else {
      colorScale = chroma.scale(colors);
    }

    // apply mode and correct lightness
    colorScale = colorScale.mode(mode).correctLightness(correctLightness);

    if (trim && colorCount <= 6) {
      colorArray = colorScale.colors(colorCount + 10).slice(6, -4);
    } else if (trim && colorCount <= 8) {
      colorArray = colorScale.colors(colorCount + 8).slice(5, -3);
    } else if (trim && colorCount <= 12) {
      colorArray = colorScale.colors(colorCount + 8).slice(5, -3);
    } else if (trim && colorCount <= 24) {
      colorArray = colorScale.colors(colorCount + 8).slice(5, -3);
    } else if (trim) {
      colorArray = colorScale.colors(colorCount + 8).slice(5, -3);
    } else {
      colorArray = colorScale.colors(colorCount);
    }

    return hasIndex ? colorArray[colorIndex >= colorCount ? colorCount : colorIndex] : colorArray;
  },

  /**
   * Return a single color from the string supplied.
   * @param {string} seed An integer or string which when passed will cause randomColor to return the same color each time.
   * @param {string} luminosity Controls the luminosity of the generated color. You can specify a string containing bright, light or dark
   * @returns {string}
   */
  random: (seed, luminosity = 'dark') => {
    return randomcolor({ seed, luminosity });
  },

  /**
   * Return either white or black (text) to ensure a minimum contrast with another color (bg)
   * @param {color} seed A color string (hex, rgb, hsl...) string which when passed will cause randomColor to return the same color each time.
   * @param {diff} luminosity Controls the luminosity of the generated color. You can specify a string containing bright, light or dark
   * @returns {string}
   */
  contrast: (color, diff = 0.4) => {
    return chroma(color).luminance() >= diff ? 'black' : 'white';
  },
};

export default utilsColor;
