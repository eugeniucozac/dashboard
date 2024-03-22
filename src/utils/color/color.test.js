import color from './color';

describe('UTILS › color', () => {
  it('should export the required methods', () => {
    expect(Object.keys(color)).toHaveLength(3);
    expect(color).toHaveProperty('scale');
    expect(color).toHaveProperty('random');
    expect(color).toHaveProperty('contrast');
  });

  describe('scale', () => {
    // values taken from https://gka.github.io/palettes/
    const colors = ['white', 'black'];

    describe('with trim', () => {
      describe('with index', () => {
        it('should return the expected colour for 6 or less colours', () => {
          expect(color.scale(6, true, 0, colors)).toBe('#919191');
          expect(color.scale(6, true, 1, colors)).toBe('#7f7f7f');
          expect(color.scale(6, true, 2, colors)).toBe('#6f6f6f');
          expect(color.scale(6, true, 3, colors)).toBe('#5e5e5e');
          expect(color.scale(6, true, 4, colors)).toBe('#4e4e4e');
          expect(color.scale(6, true, 5, colors)).toBe('#3f3f3f');
        });

        it('should return the expected colour for 8 or less colours', () => {
          expect(color.scale(8, true, 0, colors)).toBe('#a2a2a2');
          expect(color.scale(8, true, 1, colors)).toBe('#919191');
          expect(color.scale(8, true, 2, colors)).toBe('#7f7f7f');
          expect(color.scale(8, true, 3, colors)).toBe('#6f6f6f');
          expect(color.scale(8, true, 4, colors)).toBe('#5e5e5e');
          expect(color.scale(8, true, 5, colors)).toBe('#4e4e4e');
          expect(color.scale(8, true, 6, colors)).toBe('#3f3f3f');
          expect(color.scale(8, true, 7, colors)).toBe('#303030');
        });

        it('should return the expected colour for 12 or less colours', () => {
          expect(color.scale(12, true, 0, colors)).toBe('#b5b5b5');
          expect(color.scale(12, true, 1, colors)).toBe('#a7a7a7');
          expect(color.scale(12, true, 2, colors)).toBe('#999999');
          expect(color.scale(12, true, 3, colors)).toBe('#8b8b8b');
          expect(color.scale(12, true, 4, colors)).toBe('#7e7e7e');
          expect(color.scale(12, true, 5, colors)).toBe('#707070');
          expect(color.scale(12, true, 6, colors)).toBe('#636363');
          expect(color.scale(12, true, 7, colors)).toBe('#575757');
          expect(color.scale(12, true, 8, colors)).toBe('#4a4a4a');
          expect(color.scale(12, true, 9, colors)).toBe('#3e3e3e');
          expect(color.scale(12, true, 10, colors)).toBe('#333333');
          expect(color.scale(12, true, 11, colors)).toBe('#272727');
        });

        it('should return the expected colour for 24 or less colours', () => {
          expect(color.scale(24, true, 0, colors)).toBe('#d1d1d1');
          expect(color.scale(24, true, 1, colors)).toBe('#c8c8c8');
          expect(color.scale(24, true, 2, colors)).toBe('#bfbfbf');
          expect(color.scale(24, true, 3, colors)).toBe('#b6b6b6');
          expect(color.scale(24, true, 4, colors)).toBe('#aeaeae');
          expect(color.scale(24, true, 5, colors)).toBe('#a5a5a5');
          expect(color.scale(24, true, 6, colors)).toBe('#9c9c9c');
          expect(color.scale(24, true, 7, colors)).toBe('#949494');
          expect(color.scale(24, true, 8, colors)).toBe('#8c8c8c');
          expect(color.scale(24, true, 9, colors)).toBe('#838383');
          expect(color.scale(24, true, 10, colors)).toBe('#7b7b7b');
          expect(color.scale(24, true, 11, colors)).toBe('#737373');
          expect(color.scale(24, true, 12, colors)).toBe('#6b6b6b');
          expect(color.scale(24, true, 13, colors)).toBe('#636363');
          expect(color.scale(24, true, 14, colors)).toBe('#5b5b5b');
          expect(color.scale(24, true, 15, colors)).toBe('#535353');
          expect(color.scale(24, true, 16, colors)).toBe('#4c4c4c');
          expect(color.scale(24, true, 17, colors)).toBe('#444444');
          expect(color.scale(24, true, 18, colors)).toBe('#3d3d3d');
          expect(color.scale(24, true, 19, colors)).toBe('#363636');
          expect(color.scale(24, true, 20, colors)).toBe('#2f2f2f');
          expect(color.scale(24, true, 21, colors)).toBe('#282828');
          expect(color.scale(24, true, 22, colors)).toBe('#212121');
          expect(color.scale(24, true, 23, colors)).toBe('#1b1b1b');
        });

        it('should return the expected colour for X or more colours', () => {
          expect(color.scale(30, true, 0, colors)).toBe('#d8d8d8');
          expect(color.scale(30, true, 1, colors)).toBe('#d1d1d1');
          expect(color.scale(30, true, 2, colors)).toBe('#c9c9c9');
          expect(color.scale(30, true, 3, colors)).toBe('#c2c2c2');
          expect(color.scale(30, true, 4, colors)).toBe('#bababa');
          expect(color.scale(30, true, 5, colors)).toBe('#b3b3b3');
          expect(color.scale(30, true, 6, colors)).toBe('#acacac');
          expect(color.scale(30, true, 7, colors)).toBe('#a5a5a5');
          expect(color.scale(30, true, 8, colors)).toBe('#9d9d9d');
          expect(color.scale(30, true, 9, colors)).toBe('#969696');
          expect(color.scale(30, true, 10, colors)).toBe('#8f8f8f');
          expect(color.scale(30, true, 11, colors)).toBe('#888888');
          expect(color.scale(30, true, 12, colors)).toBe('#818181');
          expect(color.scale(30, true, 13, colors)).toBe('#7a7a7a');
          expect(color.scale(30, true, 14, colors)).toBe('#747474');
          expect(color.scale(30, true, 15, colors)).toBe('#6d6d6d');
          expect(color.scale(30, true, 16, colors)).toBe('#666666');
          expect(color.scale(30, true, 17, colors)).toBe('#606060');
          expect(color.scale(30, true, 18, colors)).toBe('#595959');
          expect(color.scale(30, true, 19, colors)).toBe('#535353');
          expect(color.scale(30, true, 20, colors)).toBe('#4c4c4c');
          expect(color.scale(30, true, 21, colors)).toBe('#464646');
          expect(color.scale(30, true, 22, colors)).toBe('#404040');
          expect(color.scale(30, true, 23, colors)).toBe('#3a3a3a');
          expect(color.scale(30, true, 24, colors)).toBe('#343434');
          expect(color.scale(30, true, 25, colors)).toBe('#2e2e2e');
          expect(color.scale(30, true, 26, colors)).toBe('#282828');
          expect(color.scale(30, true, 27, colors)).toBe('#232323');
          expect(color.scale(30, true, 28, colors)).toBe('#1d1d1d');
          expect(color.scale(30, true, 29, colors)).toBe('#181818');
        });
      });

      describe('without index', () => {
        it('should return the expected array for 6 or less colours', () => {
          expect(color.scale(6, true, null, colors)).toEqual(['#919191', '#7f7f7f', '#6f6f6f', '#5e5e5e', '#4e4e4e', '#3f3f3f']);
        });

        it('should return the expected array for 8 or less colours', () => {
          expect(color.scale(8, true, null, colors)).toEqual([
            '#a2a2a2',
            '#919191',
            '#7f7f7f',
            '#6f6f6f',
            '#5e5e5e',
            '#4e4e4e',
            '#3f3f3f',
            '#303030',
          ]);
        });

        it('should return the expected array for 12 or less colours', () => {
          expect(color.scale(12, true, null, colors)).toEqual([
            '#b5b5b5',
            '#a7a7a7',
            '#999999',
            '#8b8b8b',
            '#7e7e7e',
            '#707070',
            '#636363',
            '#575757',
            '#4a4a4a',
            '#3e3e3e',
            '#333333',
            '#272727',
          ]);
        });

        it('should return the expected array for 24 or less colours', () => {
          expect(color.scale(24, true, null, colors)).toEqual([
            '#d1d1d1',
            '#c8c8c8',
            '#bfbfbf',
            '#b6b6b6',
            '#aeaeae',
            '#a5a5a5',
            '#9c9c9c',
            '#949494',
            '#8c8c8c',
            '#838383',
            '#7b7b7b',
            '#737373',
            '#6b6b6b',
            '#636363',
            '#5b5b5b',
            '#535353',
            '#4c4c4c',
            '#444444',
            '#3d3d3d',
            '#363636',
            '#2f2f2f',
            '#282828',
            '#212121',
            '#1b1b1b',
          ]);
        });

        it('should return the expected array for X or more colours', () => {
          expect(color.scale(30, true, null, colors)).toEqual([
            '#d8d8d8',
            '#d1d1d1',
            '#c9c9c9',
            '#c2c2c2',
            '#bababa',
            '#b3b3b3',
            '#acacac',
            '#a5a5a5',
            '#9d9d9d',
            '#969696',
            '#8f8f8f',
            '#888888',
            '#818181',
            '#7a7a7a',
            '#747474',
            '#6d6d6d',
            '#666666',
            '#606060',
            '#595959',
            '#535353',
            '#4c4c4c',
            '#464646',
            '#404040',
            '#3a3a3a',
            '#343434',
            '#2e2e2e',
            '#282828',
            '#232323',
            '#1d1d1d',
            '#181818',
          ]);
        });
      });
    });

    describe('without trim', () => {
      describe('with index', () => {
        it('should return the expected colour for 6 or less colours', () => {
          expect(color.scale(6, false, 0, colors)).toBe('#ffffff');
          expect(color.scale(6, false, 1, colors)).toBe('#c6c6c6');
          expect(color.scale(6, false, 2, colors)).toBe('#919191');
          expect(color.scale(6, false, 3, colors)).toBe('#5e5e5e');
          expect(color.scale(6, false, 4, colors)).toBe('#303030');
          expect(color.scale(6, false, 5, colors)).toBe('#000000');
        });

        it('should return the expected colour for 8 or less colours', () => {
          expect(color.scale(8, false, 0, colors)).toBe('#ffffff');
          expect(color.scale(8, false, 1, colors)).toBe('#d6d6d6');
          expect(color.scale(8, false, 2, colors)).toBe('#afafaf');
          expect(color.scale(8, false, 3, colors)).toBe('#898989');
          expect(color.scale(8, false, 4, colors)).toBe('#656565');
          expect(color.scale(8, false, 5, colors)).toBe('#434343');
          expect(color.scale(8, false, 6, colors)).toBe('#242424');
          expect(color.scale(8, false, 7, colors)).toBe('#000000');
        });

        it('should return the expected colour for 12 or less colours', () => {
          expect(color.scale(12, false, 0, colors)).toBe('#ffffff');
          expect(color.scale(12, false, 1, colors)).toBe('#e5e5e5');
          expect(color.scale(12, false, 2, colors)).toBe('#cbcbcb');
          expect(color.scale(12, false, 3, colors)).toBe('#b2b2b2');
          expect(color.scale(12, false, 4, colors)).toBe('#9a9a9a');
          expect(color.scale(12, false, 5, colors)).toBe('#828282');
          expect(color.scale(12, false, 6, colors)).toBe('#6c6c6c');
          expect(color.scale(12, false, 7, colors)).toBe('#565656');
          expect(color.scale(12, false, 8, colors)).toBe('#404040');
          expect(color.scale(12, false, 9, colors)).toBe('#2c2c2c');
          expect(color.scale(12, false, 10, colors)).toBe('#1a1a1a');
          expect(color.scale(12, false, 11, colors)).toBe('#000000');
        });

        it('should return the expected colour for 24 or less colours', () => {
          expect(color.scale(24, false, 0, colors)).toBe('#ffffff');
          expect(color.scale(24, false, 1, colors)).toBe('#f2f2f2');
          expect(color.scale(24, false, 2, colors)).toBe('#e6e6e6');
          expect(color.scale(24, false, 3, colors)).toBe('#dadada');
          expect(color.scale(24, false, 4, colors)).toBe('#cecece');
          expect(color.scale(24, false, 5, colors)).toBe('#c2c2c2');
          expect(color.scale(24, false, 6, colors)).toBe('#b6b6b6');
          expect(color.scale(24, false, 7, colors)).toBe('#aaaaaa');
          expect(color.scale(24, false, 8, colors)).toBe('#9e9e9e');
          expect(color.scale(24, false, 9, colors)).toBe('#939393');
          expect(color.scale(24, false, 10, colors)).toBe('#888888');
          expect(color.scale(24, false, 11, colors)).toBe('#7c7c7c');
          expect(color.scale(24, false, 12, colors)).toBe('#717171');
          expect(color.scale(24, false, 13, colors)).toBe('#676767');
          expect(color.scale(24, false, 14, colors)).toBe('#5c5c5c');
          expect(color.scale(24, false, 15, colors)).toBe('#525252');
          expect(color.scale(24, false, 16, colors)).toBe('#484848');
          expect(color.scale(24, false, 17, colors)).toBe('#3e3e3e');
          expect(color.scale(24, false, 18, colors)).toBe('#343434');
          expect(color.scale(24, false, 19, colors)).toBe('#2b2b2b');
          expect(color.scale(24, false, 20, colors)).toBe('#222222');
          expect(color.scale(24, false, 21, colors)).toBe('#191919');
          expect(color.scale(24, false, 22, colors)).toBe('#0f0f0f');
          expect(color.scale(24, false, 23, colors)).toBe('#000000');
        });

        it('should return the expected colour for X or more colours', () => {
          expect(color.scale(30, false, 0, colors)).toBe('#ffffff');
          expect(color.scale(30, false, 1, colors)).toBe('#f5f5f5');
          expect(color.scale(30, false, 2, colors)).toBe('#ebebeb');
          expect(color.scale(30, false, 3, colors)).toBe('#e1e1e1');
          expect(color.scale(30, false, 4, colors)).toBe('#d8d8d8');
          expect(color.scale(30, false, 5, colors)).toBe('#cecece');
          expect(color.scale(30, false, 6, colors)).toBe('#c4c4c4');
          expect(color.scale(30, false, 7, colors)).toBe('#bbbbbb');
          expect(color.scale(30, false, 8, colors)).toBe('#b2b2b2');
          expect(color.scale(30, false, 9, colors)).toBe('#a8a8a8');
          expect(color.scale(30, false, 10, colors)).toBe('#9f9f9f');
          expect(color.scale(30, false, 11, colors)).toBe('#969696');
          expect(color.scale(30, false, 12, colors)).toBe('#8d8d8d');
          expect(color.scale(30, false, 13, colors)).toBe('#848484');
          expect(color.scale(30, false, 14, colors)).toBe('#7b7b7b');
          expect(color.scale(30, false, 15, colors)).toBe('#737373');
          expect(color.scale(30, false, 16, colors)).toBe('#6a6a6a');
          expect(color.scale(30, false, 17, colors)).toBe('#626262');
          expect(color.scale(30, false, 18, colors)).toBe('#595959');
          expect(color.scale(30, false, 19, colors)).toBe('#515151');
          expect(color.scale(30, false, 20, colors)).toBe('#494949');
          expect(color.scale(30, false, 21, colors)).toBe('#414141');
          expect(color.scale(30, false, 22, colors)).toBe('#393939');
          expect(color.scale(30, false, 23, colors)).toBe('#323232');
          expect(color.scale(30, false, 24, colors)).toBe('#2a2a2a');
          expect(color.scale(30, false, 25, colors)).toBe('#232323');
          expect(color.scale(30, false, 26, colors)).toBe('#1c1c1c');
          expect(color.scale(30, false, 27, colors)).toBe('#151515');
          expect(color.scale(30, false, 28, colors)).toBe('#0c0c0c');
          expect(color.scale(30, false, 29, colors)).toBe('#000000');
        });
      });

      describe('without index', () => {
        it('should return the expected array for 6 or less colours', () => {
          expect(color.scale(6, false, null, colors)).toEqual(['#ffffff', '#c6c6c6', '#919191', '#5e5e5e', '#303030', '#000000']);
        });

        it('should return the expected array for 8 or less colours', () => {
          expect(color.scale(8, false, null, colors)).toEqual([
            '#ffffff',
            '#d6d6d6',
            '#afafaf',
            '#898989',
            '#656565',
            '#434343',
            '#242424',
            '#000000',
          ]);
        });

        it('should return the expected array for 12 or less colours', () => {
          expect(color.scale(12, false, null, colors)).toEqual([
            '#ffffff',
            '#e5e5e5',
            '#cbcbcb',
            '#b2b2b2',
            '#9a9a9a',
            '#828282',
            '#6c6c6c',
            '#565656',
            '#404040',
            '#2c2c2c',
            '#1a1a1a',
            '#000000',
          ]);
        });

        it('should return the expected array for 24 or less colours', () => {
          expect(color.scale(24, false, null, colors)).toEqual([
            '#ffffff',
            '#f2f2f2',
            '#e6e6e6',
            '#dadada',
            '#cecece',
            '#c2c2c2',
            '#b6b6b6',
            '#aaaaaa',
            '#9e9e9e',
            '#939393',
            '#888888',
            '#7c7c7c',
            '#717171',
            '#676767',
            '#5c5c5c',
            '#525252',
            '#484848',
            '#3e3e3e',
            '#343434',
            '#2b2b2b',
            '#222222',
            '#191919',
            '#0f0f0f',
            '#000000',
          ]);
        });

        it('should return the expected array for X or more colours', () => {
          expect(color.scale(30, false, null, colors)).toEqual([
            '#ffffff',
            '#f5f5f5',
            '#ebebeb',
            '#e1e1e1',
            '#d8d8d8',
            '#cecece',
            '#c4c4c4',
            '#bbbbbb',
            '#b2b2b2',
            '#a8a8a8',
            '#9f9f9f',
            '#969696',
            '#8d8d8d',
            '#848484',
            '#7b7b7b',
            '#737373',
            '#6a6a6a',
            '#626262',
            '#595959',
            '#515151',
            '#494949',
            '#414141',
            '#393939',
            '#323232',
            '#2a2a2a',
            '#232323',
            '#1c1c1c',
            '#151515',
            '#0c0c0c',
            '#000000',
          ]);
        });
      });
    });
  });

  describe('random', () => {
    it('should return the expected random colour based on the string passed', () => {
      expect(color.random('string')).toBe('#01138c');
      expect(color.random('anotherString')).toBe('#058c34');
      expect(color.random('string', 'light')).toBe('#798afc');
      expect(color.random('string', 'bright')).toBe('#0929f9');
    });
  });

  describe('contrast', () => {
    it('should return "white" if the color luminance is below the default threshold', () => {
      expect(color.contrast('#000')).toBe('white');
      expect(color.contrast('#111')).toBe('white');
      expect(color.contrast('#222')).toBe('white');
      expect(color.contrast('#333')).toBe('white');
      expect(color.contrast('#444')).toBe('white');
      expect(color.contrast('#555')).toBe('white');
      expect(color.contrast('#666')).toBe('white');
      expect(color.contrast('#777')).toBe('white');
      expect(color.contrast('#888')).toBe('white');
      expect(color.contrast('#999')).toBe('white');
      expect(color.contrast('#aaa')).not.toBe('white');
      expect(color.contrast('#bbb')).not.toBe('white');
      expect(color.contrast('#ccc')).not.toBe('white');
      expect(color.contrast('#ddd')).not.toBe('white');
      expect(color.contrast('#eee')).not.toBe('white');
      expect(color.contrast('#fff')).not.toBe('white');
    });

    it('should return "black" if the color luminance is above the default threshold', () => {
      expect(color.contrast('#000')).not.toBe('black');
      expect(color.contrast('#111')).not.toBe('black');
      expect(color.contrast('#222')).not.toBe('black');
      expect(color.contrast('#333')).not.toBe('black');
      expect(color.contrast('#444')).not.toBe('black');
      expect(color.contrast('#555')).not.toBe('black');
      expect(color.contrast('#666')).not.toBe('black');
      expect(color.contrast('#777')).not.toBe('black');
      expect(color.contrast('#888')).not.toBe('black');
      expect(color.contrast('#999')).not.toBe('black');
      expect(color.contrast('#aaa')).toBe('black');
      expect(color.contrast('#bbb')).toBe('black');
      expect(color.contrast('#ccc')).toBe('black');
      expect(color.contrast('#ddd')).toBe('black');
      expect(color.contrast('#eee')).toBe('black');
      expect(color.contrast('#fff')).toBe('black');
    });

    it('should return the correct color based on the color and custom threshold', () => {
      expect(color.contrast('#000', 0.7)).toBe('white');
      expect(color.contrast('#111', 0.7)).toBe('white');
      expect(color.contrast('#222', 0.7)).toBe('white');
      expect(color.contrast('#333', 0.7)).toBe('white');
      expect(color.contrast('#444', 0.7)).toBe('white');
      expect(color.contrast('#555', 0.7)).toBe('white');
      expect(color.contrast('#666', 0.7)).toBe('white');
      expect(color.contrast('#777', 0.7)).toBe('white');
      expect(color.contrast('#888', 0.7)).toBe('white');
      expect(color.contrast('#999', 0.7)).toBe('white');
      expect(color.contrast('#aaa', 0.7)).toBe('white');
      expect(color.contrast('#bbb', 0.7)).toBe('white');
      expect(color.contrast('#ccc', 0.7)).toBe('white');
      expect(color.contrast('#ddd', 0.7)).toBe('black');
      expect(color.contrast('#eee', 0.7)).toBe('black');
      expect(color.contrast('#fff', 0.7)).toBe('black');
    });
  });
});
