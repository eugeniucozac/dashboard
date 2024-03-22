import * as utils from 'utils';

describe('UTILS › excel', () => {
  const stringWithoutLineBreaks = `Location	City	Zip	State	Street Address	TIV
1	Atlanta	11111	GA	123 Braves Road, Atlanta	100000
2	New York	22222	NY	456 Mets Street, New York	200000
3	Houston	33333	TX	789 Astros Avenue, Houston	300000`;

  const stringWithLineBreaks = `Location	City	Zip	State	Street Address	TIV
1	Atlanta	11111	GA	"123 Braves Road, 
Atlanta"	100000
2	"New 
York"	22222	NY	"456 
Mets 
Street", New York	200000
3	Houston	33333	TX	789 Astros Avenue, Houston	300000`;

  const expectedString = `Location	City	Zip	State	Street Address	TIV
1	Atlanta	11111	GA	123 Braves Road, Atlanta	100000
2	New York	22222	NY	456 Mets Street, New York	200000
3	Houston	33333	TX	789 Astros Avenue, Houston	300000`;

  describe('removeLineBreaksWithinCell', () => {
    it('should remove inter cells line breaks', () => {
      // assert
      expect(utils.excel.removeLineBreaksWithinCell(stringWithoutLineBreaks)).toEqual(expectedString);
      expect(utils.excel.removeLineBreaksWithinCell(stringWithLineBreaks)).toEqual(expectedString);
    });
  });

  describe('splitCellsByRow', () => {
    it('should return array of rows with array of cells', () => {
      // assert
      expect(utils.excel.splitCellsByRow(stringWithoutLineBreaks)).toEqual([
        ['Location', 'City', 'Zip', 'State', 'Street Address', 'TIV'],
        ['1', 'Atlanta', '11111', 'GA', '123 Braves Road, Atlanta', '100000'],
        ['2', 'New York', '22222', 'NY', '456 Mets Street, New York', '200000'],
        ['3', 'Houston', '33333', 'TX', '789 Astros Avenue, Houston', '300000'],
      ]);
    });
  });

  describe('getColumns', () => {
    it('should return an array of camelCases column headers', () => {
      // arrange
      const rows = utils.excel.splitCellsByRow(stringWithoutLineBreaks);

      // assert
      expect(utils.excel.getColumns(rows)).toEqual(['location', 'city', 'zip', 'state', 'streetAddress', 'tiv']);
    });
  });

  describe('getObjects', () => {
    it('should return an array of location object with camelCased properties', () => {
      // arrange
      const rows = utils.excel.splitCellsByRow(stringWithoutLineBreaks);

      // assert
      expect(utils.excel.getObjects(rows)).toEqual([
        {
          location: '1',
          city: 'Atlanta',
          zip: '11111',
          state: 'GA',
          streetAddress: '123 Braves Road, Atlanta',
          tiv: '100000',
        },
        {
          location: '2',
          city: 'New York',
          zip: '22222',
          state: 'NY',
          streetAddress: '456 Mets Street, New York',
          tiv: '200000',
        },
        {
          location: '3',
          city: 'Houston',
          zip: '33333',
          state: 'TX',
          streetAddress: '789 Astros Avenue, Houston',
          tiv: '300000',
        },
      ]);
    });
  });
});
