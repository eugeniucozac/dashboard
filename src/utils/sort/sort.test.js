import sort from './sort';

describe('UTILS', () => {
  describe('sort', () => {
    it('should export the required methods', () => {
      expect(sort).toHaveProperty('array');
      expect(sort).toHaveProperty('arrayNestedPropertyValue');
    });

    describe('arrayNestedPropertyValue', () => {
      const sortArray = [
        {
          id: 3,
          market: {
            id: 1,
            name: 'B',
          },
        },
        {
          id: 1,
          market: {
            id: 1,
            name: 'Z',
          },
        },
        {
          id: 2,
          market: {
            id: 2,
            name: 'A',
          },
        },
      ];
      it('sort ASC array by nested property value', () => {
        const sortedArray = sort.arrayNestedPropertyValue(sortArray, 'market.name', 'asc');

        expect(sortedArray).toEqual([
          {
            id: 2,
            market: {
              id: 2,
              name: 'A',
            },
          },
          {
            id: 3,
            market: {
              id: 1,
              name: 'B',
            },
          },
          {
            id: 1,
            market: {
              id: 1,
              name: 'Z',
            },
          },
        ]);
      });

      it('sort DESC array by nested property value', () => {
        const sortedArray = sort.arrayNestedPropertyValue(sortArray, 'market.name', 'desc');

        expect(sortedArray).toEqual([
          {
            id: 1,
            market: {
              id: 1,
              name: 'Z',
            },
          },
          {
            id: 3,
            market: {
              id: 1,
              name: 'B',
            },
          },
          {
            id: 2,
            market: {
              id: 2,
              name: 'A',
            },
          },
        ]);
      });
    });

    describe('lexical', () => {
      describe('ASC', () => {
        it('should handle sorting', () => {
          const sorting = sort.array('lexical', 'id');

          expect([{ id: 'a' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'a' }, { id: 'b' }]);
          expect([{ id: 'aaa' }, { id: 'bbb' }].sort(sorting)).toEqual([{ id: 'aaa' }, { id: 'bbb' }]);
          expect([{ id: 'abc' }, { id: 'xyz' }].sort(sorting)).toEqual([{ id: 'abc' }, { id: 'xyz' }]);
          expect([{ id: 'abc1' }, { id: 'abc2' }].sort(sorting)).toEqual([{ id: 'abc1' }, { id: 'abc2' }]);
          expect([{ id: 'abc100' }, { id: 'abc2' }].sort(sorting)).toEqual([{ id: 'abc100' }, { id: 'abc2' }]);
          expect([{ id: '0' }, { id: '1' }].sort(sorting)).toEqual([{ id: '0' }, { id: '1' }]);
          expect([{ id: '00' }, { id: '01' }].sort(sorting)).toEqual([{ id: '00' }, { id: '01' }]);
          expect([{ id: '11' }, { id: '12' }].sort(sorting)).toEqual([{ id: '11' }, { id: '12' }]);
          expect([{ id: '0' }, { id: '1' }].sort(sorting)).toEqual([{ id: '0' }, { id: '1' }]);
          expect([{ id: '00' }, { id: '01' }].sort(sorting)).toEqual([{ id: '00' }, { id: '01' }]);
          expect([{ id: 10 }, { id: 2 }].sort(sorting)).toEqual([{ id: 10 }, { id: 2 }]);
          expect([{ id: '01-01-1970' }, { id: '01-01-1971' }].sort(sorting)).toEqual([{ id: '01-01-1970' }, { id: '01-01-1971' }]);
        });

        it('should handle sorting and leave identical values in original order', () => {
          const sorting = sort.array('lexical', 'id');

          expect(
            [
              { id: '', foo: 1 },
              { id: '', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '', foo: 1 },
            { id: '', foo: 2 },
          ]);
          expect(
            [
              { id: 'a', foo: 1 },
              { id: 'a', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'a', foo: 1 },
            { id: 'a', foo: 2 },
          ]);
          expect(
            [
              { id: 'B', foo: 1 },
              { id: 'B', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'B', foo: 1 },
            { id: 'B', foo: 2 },
          ]);
          expect(
            [
              { id: '0', foo: 1 },
              { id: '0', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '0', foo: 1 },
            { id: '0', foo: 2 },
          ]);
          expect(
            [
              { id: '10', foo: 1 },
              { id: '10', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '10', foo: 1 },
            { id: '10', foo: 2 },
          ]);
          expect(
            [
              { id: 0, foo: 1 },
              { id: 0, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0, foo: 1 },
            { id: 0, foo: 2 },
          ]);
          expect(
            [
              { id: 100, foo: 1 },
              { id: 100, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 100, foo: 1 },
            { id: 100, foo: 2 },
          ]);
        });

        it('should handle sorting and trim white space', () => {
          const sorting = sort.array('lexical', 'id');

          expect([{ id: '  a' }, { id: 'b' }].sort(sorting)).toEqual([{ id: '  a' }, { id: 'b' }]);
          expect([{ id: 'a' }, { id: '  b' }].sort(sorting)).toEqual([{ id: 'a' }, { id: '  b' }]);
          expect([{ id: '  a' }, { id: '  b' }].sort(sorting)).toEqual([{ id: '  a' }, { id: '  b' }]);
          expect([{ id: '  b' }, { id: 'a' }].sort(sorting)).toEqual([{ id: 'a' }, { id: '  b' }]);
          expect([{ id: 'b' }, { id: '  a' }].sort(sorting)).toEqual([{ id: '  a' }, { id: 'b' }]);
          expect([{ id: '  b' }, { id: '  a' }].sort(sorting)).toEqual([{ id: '  a' }, { id: '  b' }]);
        });

        it('should handle sorting with falsy values at the end by default', () => {
          const sorting = sort.array('lexical', 'id');

          expect([{ id: '' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'b' }, { id: '' }]);
          expect([{ id: 0 }, { id: 1 }].sort(sorting)).toEqual([{ id: 1 }, { id: 0 }]);
          expect([{ id: 0 }, { id: 10 }].sort(sorting)).toEqual([{ id: 10 }, { id: 0 }]);
          expect([{ id: 0.0 }, { id: 10.0 }].sort(sorting)).toEqual([{ id: 10.0 }, { id: 0.0 }]);
        });

        it('should handle sorting with falsy value sorted normally', () => {
          const sorting = sort.array('lexical', 'id', 1, false);

          expect(
            [
              { id: '', foo: 1 },
              { id: '', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '', foo: 1 },
            { id: '', foo: 2 },
          ]);
          expect([{ id: '' }, { id: 'b' }].sort(sorting)).toEqual([{ id: '' }, { id: 'b' }]);
          expect([{ id: 0 }, { id: 1 }].sort(sorting)).toEqual([{ id: 0 }, { id: 1 }]);
          expect([{ id: 0 }, { id: 10 }].sort(sorting)).toEqual([{ id: 0 }, { id: 10 }]);
          expect([{ id: 0.0 }, { id: 10.0 }].sort(sorting)).toEqual([{ id: 0.0 }, { id: 10.0 }]);
          expect([{ id: 10 }, { id: 2 }].sort(sorting)).toEqual([{ id: 10 }, { id: 2 }]);
        });

        it('should handle sorting case insensitive', () => {
          const sorting = sort.array('lexical', 'id');

          expect([{ id: 'a' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'a' }, { id: 'b' }]);
          expect([{ id: 'A' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'A' }, { id: 'b' }]);
          expect([{ id: 'a' }, { id: 'B' }].sort(sorting)).toEqual([{ id: 'a' }, { id: 'B' }]);
          expect([{ id: 'A' }, { id: 'B' }].sort(sorting)).toEqual([{ id: 'A' }, { id: 'B' }]);
          expect([{ id: 'CU' }, { id: 'Co' }].sort(sorting)).toEqual([{ id: 'Co' }, { id: 'CU' }]);
        });
      });

      describe('DESC', () => {
        it('should handle sorting', () => {
          const sorting = sort.array('lexical', 'id', -1);

          expect(
            [
              { id: 'a', foo: 1 },
              { id: 'a', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'a', foo: 1 },
            { id: 'a', foo: 2 },
          ]);
          expect(
            [
              { id: 'A', foo: 1 },
              { id: 'A', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'A', foo: 1 },
            { id: 'A', foo: 2 },
          ]);
          expect([{ id: 'a' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'b' }, { id: 'a' }]);
          expect([{ id: 'aaa' }, { id: 'bbb' }].sort(sorting)).toEqual([{ id: 'bbb' }, { id: 'aaa' }]);
          expect([{ id: 'abc' }, { id: 'xyz' }].sort(sorting)).toEqual([{ id: 'xyz' }, { id: 'abc' }]);
          expect([{ id: 'abc1' }, { id: 'abc2' }].sort(sorting)).toEqual([{ id: 'abc2' }, { id: 'abc1' }]);
          expect([{ id: 'abc100' }, { id: 'abc2' }].sort(sorting)).toEqual([{ id: 'abc2' }, { id: 'abc100' }]);
          expect([{ id: '0' }, { id: '1' }].sort(sorting)).toEqual([{ id: '1' }, { id: '0' }]);
          expect([{ id: '00' }, { id: '01' }].sort(sorting)).toEqual([{ id: '01' }, { id: '00' }]);
          expect([{ id: '11' }, { id: '12' }].sort(sorting)).toEqual([{ id: '12' }, { id: '11' }]);
          expect([{ id: '0' }, { id: '1' }].sort(sorting)).toEqual([{ id: '1' }, { id: '0' }]);
          expect([{ id: '00' }, { id: '01' }].sort(sorting)).toEqual([{ id: '01' }, { id: '00' }]);
          expect([{ id: 10 }, { id: 2 }].sort(sorting)).toEqual([{ id: 2 }, { id: 10 }]);
          expect([{ id: '01-01-1970' }, { id: '01-01-1971' }].sort(sorting)).toEqual([{ id: '01-01-1971' }, { id: '01-01-1970' }]);
        });

        it('should handle sorting and leave identical values in original order', () => {
          const sorting = sort.array('lexical', 'id', -1);

          expect(
            [
              { id: '', foo: 1 },
              { id: '', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '', foo: 1 },
            { id: '', foo: 2 },
          ]);
          expect(
            [
              { id: 'a', foo: 1 },
              { id: 'a', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'a', foo: 1 },
            { id: 'a', foo: 2 },
          ]);
          expect(
            [
              { id: 'B', foo: 1 },
              { id: 'B', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'B', foo: 1 },
            { id: 'B', foo: 2 },
          ]);
          expect(
            [
              { id: '0', foo: 1 },
              { id: '0', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '0', foo: 1 },
            { id: '0', foo: 2 },
          ]);
          expect(
            [
              { id: '10', foo: 1 },
              { id: '10', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '10', foo: 1 },
            { id: '10', foo: 2 },
          ]);
          expect(
            [
              { id: 0, foo: 1 },
              { id: 0, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0, foo: 1 },
            { id: 0, foo: 2 },
          ]);
          expect(
            [
              { id: 100, foo: 1 },
              { id: 100, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 100, foo: 1 },
            { id: 100, foo: 2 },
          ]);
        });

        it('should handle sorting and trim white space', () => {
          const sorting = sort.array('lexical', 'id', -1);

          expect([{ id: '  a' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'b' }, { id: '  a' }]);
          expect([{ id: 'a' }, { id: '  b' }].sort(sorting)).toEqual([{ id: '  b' }, { id: 'a' }]);
          expect([{ id: '  a' }, { id: '  b' }].sort(sorting)).toEqual([{ id: '  b' }, { id: '  a' }]);
          expect([{ id: '  b' }, { id: 'a' }].sort(sorting)).toEqual([{ id: '  b' }, { id: 'a' }]);
          expect([{ id: 'b' }, { id: '  a' }].sort(sorting)).toEqual([{ id: 'b' }, { id: '  a' }]);
          expect([{ id: '  b' }, { id: '  a' }].sort(sorting)).toEqual([{ id: '  b' }, { id: '  a' }]);
        });

        it('should handle sorting with falsy values at the end by default', () => {
          const sorting = sort.array('lexical', 'id', -1);

          expect([{ id: '' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'b' }, { id: '' }]);
          expect([{ id: 0 }, { id: 1 }].sort(sorting)).toEqual([{ id: 1 }, { id: 0 }]);
          expect([{ id: 0 }, { id: 10 }].sort(sorting)).toEqual([{ id: 10 }, { id: 0 }]);
          expect([{ id: 0.0 }, { id: 10.0 }].sort(sorting)).toEqual([{ id: 10.0 }, { id: 0.0 }]);
        });

        it('should handle sorting with falsy value sorted normally', () => {
          const sorting = sort.array('lexical', 'id', -1, false);

          expect(
            [
              { id: '', foo: 1 },
              { id: '', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '', foo: 1 },
            { id: '', foo: 2 },
          ]);
          expect([{ id: '' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'b' }, { id: '' }]);
          expect([{ id: 0 }, { id: 1 }].sort(sorting)).toEqual([{ id: 1 }, { id: 0 }]);
          expect([{ id: 0 }, { id: 10 }].sort(sorting)).toEqual([{ id: 10 }, { id: 0 }]);
          expect([{ id: 0.0 }, { id: 10.0 }].sort(sorting)).toEqual([{ id: 10.0 }, { id: 0.0 }]);
          expect([{ id: 10 }, { id: 2 }].sort(sorting)).toEqual([{ id: 2 }, { id: 10 }]);
        });

        it('should handle sorting case insensitive', () => {
          const sorting = sort.array('lexical', 'id', -1);

          expect([{ id: 'a' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'b' }, { id: 'a' }]);
          expect([{ id: 'A' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'b' }, { id: 'A' }]);
          expect([{ id: 'a' }, { id: 'B' }].sort(sorting)).toEqual([{ id: 'B' }, { id: 'a' }]);
          expect([{ id: 'A' }, { id: 'B' }].sort(sorting)).toEqual([{ id: 'B' }, { id: 'A' }]);
          expect([{ id: 'CU' }, { id: 'Co' }].sort(sorting)).toEqual([{ id: 'CU' }, { id: 'Co' }]);
        });
      });
    });

    describe('numeric', () => {
      describe('ASC', () => {
        it('should handle sorting', () => {
          const sorting = sort.array('numeric', 'id');

          expect([{ id: 0 }, { id: 1 }].sort(sorting)).toEqual([{ id: 0 }, { id: 1 }]);
          expect([{ id: 0.0 }, { id: 1.0 }].sort(sorting)).toEqual([{ id: 0.0 }, { id: 1.0 }]);
          expect([{ id: 0.01 }, { id: 0.02 }].sort(sorting)).toEqual([{ id: 0.01 }, { id: 0.02 }]);
          expect([{ id: 0.001 }, { id: 0.002 }].sort(sorting)).toEqual([{ id: 0.001 }, { id: 0.002 }]);
          expect([{ id: 0.0001 }, { id: 0.0002 }].sort(sorting)).toEqual([{ id: 0.0001 }, { id: 0.0002 }]);
          expect([{ id: 0.00001 }, { id: 0.00002 }].sort(sorting)).toEqual([{ id: 0.00001 }, { id: 0.00002 }]);
          expect([{ id: 0.000001 }, { id: 0.000002 }].sort(sorting)).toEqual([{ id: 0.000001 }, { id: 0.000002 }]);
          expect([{ id: 0.0000001 }, { id: 0.0000002 }].sort(sorting)).toEqual([{ id: 0.0000001 }, { id: 0.0000002 }]);
          expect([{ id: 0.00000001 }, { id: 0.00000002 }].sort(sorting)).toEqual([{ id: 0.00000001 }, { id: 0.00000002 }]);
          expect([{ id: 0.000000001 }, { id: 0.000000002 }].sort(sorting)).toEqual([{ id: 0.000000001 }, { id: 0.000000002 }]);
          expect([{ id: 1 }, { id: 2 }].sort(sorting)).toEqual([{ id: 1 }, { id: 2 }]);
          expect([{ id: 1 }, { id: 1.00001 }].sort(sorting)).toEqual([{ id: 1 }, { id: 1.00001 }]);
          expect([{ id: 2 }, { id: 0 }].sort(sorting)).toEqual([{ id: 0 }, { id: 2 }]);
          expect([{ id: 2 }, { id: 1 }].sort(sorting)).toEqual([{ id: 1 }, { id: 2 }]);
          expect([{ id: 2 }, { id: 10 }].sort(sorting)).toEqual([{ id: 2 }, { id: 10 }]);
        });

        it('should handle sorting and leave identical values in original order', () => {
          const sorting = sort.array('numeric', 'id');

          expect(
            [
              { id: 0, foo: 1 },
              { id: 0, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0, foo: 1 },
            { id: 0, foo: 2 },
          ]);
          expect(
            [
              { id: 0.0, foo: 1 },
              { id: 0.0, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.0, foo: 1 },
            { id: 0.0, foo: 2 },
          ]);
          expect(
            [
              { id: 0.01, foo: 1 },
              { id: 0.01, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.01, foo: 1 },
            { id: 0.01, foo: 2 },
          ]);
          expect(
            [
              { id: 0.001, foo: 1 },
              { id: 0.001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.001, foo: 1 },
            { id: 0.001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.0001, foo: 1 },
              { id: 0.0001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.0001, foo: 1 },
            { id: 0.0001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.00001, foo: 1 },
              { id: 0.00001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.00001, foo: 1 },
            { id: 0.00001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.000001, foo: 1 },
              { id: 0.000001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.000001, foo: 1 },
            { id: 0.000001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.0000001, foo: 1 },
              { id: 0.0000001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.0000001, foo: 1 },
            { id: 0.0000001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.00000001, foo: 1 },
              { id: 0.00000001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.00000001, foo: 1 },
            { id: 0.00000001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.000000001, foo: 1 },
              { id: 0.000000001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.000000001, foo: 1 },
            { id: 0.000000001, foo: 2 },
          ]);
          expect(
            [
              { id: 1, foo: 1 },
              { id: 1, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 1, foo: 1 },
            { id: 1, foo: 2 },
          ]);
          expect(
            [
              { id: 1.01, foo: 1 },
              { id: 1.01, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 1.01, foo: 1 },
            { id: 1.01, foo: 2 },
          ]);
        });

        it('should handle sorting and gracefully support non-numeric values', () => {
          const sorting = sort.array('numeric', 'id');

          expect(
            [
              { id: '0', foo: 1 },
              { id: '0', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '0', foo: 1 },
            { id: '0', foo: 2 },
          ]);
          expect(
            [
              { id: '1', foo: 1 },
              { id: '1', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1', foo: 1 },
            { id: '1', foo: 2 },
          ]);
          expect(
            [
              { id: 'a', foo: 1 },
              { id: 'a', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'a', foo: 1 },
            { id: 'a', foo: 2 },
          ]);

          expect([{ id: 'a' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'a' }, { id: 'b' }]);
          expect([{ id: 'b' }, { id: 'a' }].sort(sorting)).toEqual([{ id: 'b' }, { id: 'a' }]);
          expect([{ id: 'c1' }, { id: 'c2' }].sort(sorting)).toEqual([{ id: 'c1' }, { id: 'c2' }]);
          expect([{ id: '0' }, { id: '1' }].sort(sorting)).toEqual([{ id: '0' }, { id: '1' }]);
          expect([{ id: '0.0' }, { id: '1.0' }].sort(sorting)).toEqual([{ id: '0.0' }, { id: '1.0' }]);
          expect([{ id: '0.01' }, { id: '0.02' }].sort(sorting)).toEqual([{ id: '0.01' }, { id: '0.02' }]);
          expect([{ id: '1' }, { id: '1.00001' }].sort(sorting)).toEqual([{ id: '1' }, { id: '1.00001' }]);
          expect([{ id: '1' }, { id: '1.000010000' }].sort(sorting)).toEqual([{ id: '1' }, { id: '1.000010000' }]);
          expect([{ id: '00' }, { id: '01' }].sort(sorting)).toEqual([{ id: '00' }, { id: '01' }]);
          expect([{ id: '100' }, { id: '20' }].sort(sorting)).toEqual([{ id: '20' }, { id: '100' }]);
          expect([{ id: '100.01.02' }, { id: '100.88.99' }].sort(sorting)).toEqual([{ id: '100.01.02' }, { id: '100.88.99' }]);
          expect([{ id: '01-01-1970' }, { id: '01-01-1971' }].sort(sorting)).toEqual([{ id: '01-01-1970' }, { id: '01-01-1971' }]);
        });
      });

      describe('DESC', () => {
        it('should handle sorting', () => {
          const sorting = sort.array('numeric', 'id', -1);

          expect([{ id: 0 }, { id: 1 }].sort(sorting)).toEqual([{ id: 1 }, { id: 0 }]);
          expect([{ id: 0.0 }, { id: 1.0 }].sort(sorting)).toEqual([{ id: 1.0 }, { id: 0.0 }]);
          expect([{ id: 0.01 }, { id: 0.02 }].sort(sorting)).toEqual([{ id: 0.02 }, { id: 0.01 }]);
          expect([{ id: 0.001 }, { id: 0.002 }].sort(sorting)).toEqual([{ id: 0.002 }, { id: 0.001 }]);
          expect([{ id: 0.0001 }, { id: 0.0002 }].sort(sorting)).toEqual([{ id: 0.0002 }, { id: 0.0001 }]);
          expect([{ id: 0.00001 }, { id: 0.00002 }].sort(sorting)).toEqual([{ id: 0.00002 }, { id: 0.00001 }]);
          expect([{ id: 0.000001 }, { id: 0.000002 }].sort(sorting)).toEqual([{ id: 0.000002 }, { id: 0.000001 }]);
          expect([{ id: 0.0000001 }, { id: 0.0000002 }].sort(sorting)).toEqual([{ id: 0.0000002 }, { id: 0.0000001 }]);
          expect([{ id: 0.00000001 }, { id: 0.00000002 }].sort(sorting)).toEqual([{ id: 0.00000002 }, { id: 0.00000001 }]);
          expect([{ id: 0.000000001 }, { id: 0.000000002 }].sort(sorting)).toEqual([{ id: 0.000000002 }, { id: 0.000000001 }]);
          expect([{ id: 1 }, { id: 2 }].sort(sorting)).toEqual([{ id: 2 }, { id: 1 }]);
          expect([{ id: 1 }, { id: 1.00001 }].sort(sorting)).toEqual([{ id: 1.00001 }, { id: 1 }]);
          expect([{ id: 2 }, { id: 0 }].sort(sorting)).toEqual([{ id: 2 }, { id: 0 }]);
          expect([{ id: 2 }, { id: 1 }].sort(sorting)).toEqual([{ id: 2 }, { id: 1 }]);
          expect([{ id: 2 }, { id: 10 }].sort(sorting)).toEqual([{ id: 10 }, { id: 2 }]);
        });

        it('should handle sorting and leave identical values in original order', () => {
          const sorting = sort.array('numeric', 'id', -1);

          expect(
            [
              { id: 0, foo: 1 },
              { id: 0, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0, foo: 1 },
            { id: 0, foo: 2 },
          ]);
          expect(
            [
              { id: 0.0, foo: 1 },
              { id: 0.0, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.0, foo: 1 },
            { id: 0.0, foo: 2 },
          ]);
          expect(
            [
              { id: 0.01, foo: 1 },
              { id: 0.01, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.01, foo: 1 },
            { id: 0.01, foo: 2 },
          ]);
          expect(
            [
              { id: 0.001, foo: 1 },
              { id: 0.001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.001, foo: 1 },
            { id: 0.001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.0001, foo: 1 },
              { id: 0.0001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.0001, foo: 1 },
            { id: 0.0001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.00001, foo: 1 },
              { id: 0.00001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.00001, foo: 1 },
            { id: 0.00001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.000001, foo: 1 },
              { id: 0.000001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.000001, foo: 1 },
            { id: 0.000001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.0000001, foo: 1 },
              { id: 0.0000001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.0000001, foo: 1 },
            { id: 0.0000001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.00000001, foo: 1 },
              { id: 0.00000001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.00000001, foo: 1 },
            { id: 0.00000001, foo: 2 },
          ]);
          expect(
            [
              { id: 0.000000001, foo: 1 },
              { id: 0.000000001, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0.000000001, foo: 1 },
            { id: 0.000000001, foo: 2 },
          ]);
          expect(
            [
              { id: 1, foo: 1 },
              { id: 1, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 1, foo: 1 },
            { id: 1, foo: 2 },
          ]);
          expect(
            [
              { id: 1.01, foo: 1 },
              { id: 1.01, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 1.01, foo: 1 },
            { id: 1.01, foo: 2 },
          ]);
        });

        it('should handle sorting and gracefully support non-numeric values', () => {
          const sorting = sort.array('numeric', 'id', -1);

          expect(
            [
              { id: '0', foo: 1 },
              { id: '0', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '0', foo: 1 },
            { id: '0', foo: 2 },
          ]);
          expect(
            [
              { id: '1', foo: 1 },
              { id: '1', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1', foo: 1 },
            { id: '1', foo: 2 },
          ]);
          expect(
            [
              { id: 'a', foo: 1 },
              { id: 'a', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'a', foo: 1 },
            { id: 'a', foo: 2 },
          ]);

          expect([{ id: 'a' }, { id: 'b' }].sort(sorting)).toEqual([{ id: 'a' }, { id: 'b' }]);
          expect([{ id: 'b' }, { id: 'a' }].sort(sorting)).toEqual([{ id: 'b' }, { id: 'a' }]);
          expect([{ id: 'c1' }, { id: 'c2' }].sort(sorting)).toEqual([{ id: 'c1' }, { id: 'c2' }]);
          expect([{ id: '0' }, { id: '1' }].sort(sorting)).toEqual([{ id: '1' }, { id: '0' }]);
          expect([{ id: '0.0' }, { id: '1.0' }].sort(sorting)).toEqual([{ id: '1.0' }, { id: '0.0' }]);
          expect([{ id: '0.01' }, { id: '0.02' }].sort(sorting)).toEqual([{ id: '0.02' }, { id: '0.01' }]);
          expect([{ id: '1' }, { id: '1.00001' }].sort(sorting)).toEqual([{ id: '1.00001' }, { id: '1' }]);
          expect([{ id: '1' }, { id: '1.000010000' }].sort(sorting)).toEqual([{ id: '1.000010000' }, { id: '1' }]);
          expect([{ id: '00' }, { id: '01' }].sort(sorting)).toEqual([{ id: '01' }, { id: '00' }]);
          expect([{ id: '100' }, { id: '20' }].sort(sorting)).toEqual([{ id: '100' }, { id: '20' }]);
          expect([{ id: '100.01.02' }, { id: '100.88.99' }].sort(sorting)).toEqual([{ id: '100.01.02' }, { id: '100.88.99' }]);
          expect([{ id: '01-01-1970' }, { id: '01-01-1971' }].sort(sorting)).toEqual([{ id: '01-01-1970' }, { id: '01-01-1971' }]);
        });
      });
    });

    describe('date', () => {
      describe('ASC', () => {
        it('should handle sorting', () => {
          const sorting = sort.array('date', 'id');

          expect([{ id: 1546300800000 }, { id: 1546300800001 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: 1546300800001 }]);
          expect([{ id: 1546300800001 }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: 1546300800001 }]);
          expect([{ id: '1990' }, { id: '2000' }].sort(sorting)).toEqual([{ id: '1990' }, { id: '2000' }]);
          expect([{ id: '1990-12' }, { id: '2000-12' }].sort(sorting)).toEqual([{ id: '1990-12' }, { id: '2000-12' }]);
          expect([{ id: '1990-12-31' }, { id: '2000-12-31' }].sort(sorting)).toEqual([{ id: '1990-12-31' }, { id: '2000-12-31' }]);
          expect([{ id: '1990-12-31T23:59' }, { id: '1991-01-01T00:00' }].sort(sorting)).toEqual([
            { id: '1990-12-31T23:59' },
            { id: '1991-01-01T00:00' },
          ]);
          expect([{ id: '1990-12-31T23:59:59' }, { id: '1991-01-01T00:00:00' }].sort(sorting)).toEqual([
            { id: '1990-12-31T23:59:59' },
            { id: '1991-01-01T00:00:00' },
          ]);
          expect([{ id: '1991-01-01T00:00:00' }, { id: '1990-12-31T23:59:59' }].sort(sorting)).toEqual([
            { id: '1990-12-31T23:59:59' },
            { id: '1991-01-01T00:00:00' },
          ]);
          expect([{ id: '1991-01-01T00:00' }, { id: '1990-12-31T23:59' }].sort(sorting)).toEqual([
            { id: '1990-12-31T23:59' },
            { id: '1991-01-01T00:00' },
          ]);
          expect([{ id: '2000-12-31' }, { id: '1990-12-31' }].sort(sorting)).toEqual([{ id: '1990-12-31' }, { id: '2000-12-31' }]);
          expect([{ id: '2000-12-31' }, { id: '1990-12-31' }].sort(sorting)).toEqual([{ id: '1990-12-31' }, { id: '2000-12-31' }]);
          expect([{ id: '2000-12' }, { id: '1990-12' }].sort(sorting)).toEqual([{ id: '1990-12' }, { id: '2000-12' }]);
          expect([{ id: '2000' }, { id: '1990' }].sort(sorting)).toEqual([{ id: '1990' }, { id: '2000' }]);
        });

        it('should handle sorting and leave identical values in original order', () => {
          const sorting = sort.array('date', 'id');

          expect(
            [
              { id: 1546300800000, foo: 1 },
              { id: 1546300800000, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 1546300800000, foo: 1 },
            { id: 1546300800000, foo: 2 },
          ]);
          expect(
            [
              { id: '1990', foo: 1 },
              { id: '1990', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990', foo: 1 },
            { id: '1990', foo: 2 },
          ]);
          expect(
            [
              { id: '1990-12', foo: 1 },
              { id: '1990-12', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990-12', foo: 1 },
            { id: '1990-12', foo: 2 },
          ]);
          expect(
            [
              { id: '1990-12-31', foo: 1 },
              { id: '1990-12-31', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990-12-31', foo: 1 },
            { id: '1990-12-31', foo: 2 },
          ]);
          expect(
            [
              { id: '1990-12-31T23:59', foo: 1 },
              { id: '1990-12-31T23:59', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990-12-31T23:59', foo: 1 },
            { id: '1990-12-31T23:59', foo: 2 },
          ]);
          expect(
            [
              { id: '1990-12-31T23:59:59', foo: 1 },
              { id: '1990-12-31T23:59:59', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990-12-31T23:59:59', foo: 1 },
            { id: '1990-12-31T23:59:59', foo: 2 },
          ]);
        });

        it('should handle sorting with falsy values at the end by default', () => {
          const sorting = sort.array('date', 'id');

          expect([{ id: 0 }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: 0 }]);
          expect([{ id: 1546300800000 }, { id: 0 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: 0 }]);
          expect([{ id: null }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: null }]);
          expect([{ id: undefined }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: undefined }]);
          expect([{ id: NaN }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: NaN }]);
          expect([{ id: true }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: true }]);
          expect([{ id: false }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: false }]);
          expect([{ id: '' }, { id: '2000' }].sort(sorting)).toEqual([{ id: '2000' }, { id: '' }]);
          expect([{ id: ' ' }, { id: '2000' }].sort(sorting)).toEqual([{ id: '2000' }, { id: ' ' }]);
          expect([{ id: 'abc' }, { id: '2000' }].sort(sorting)).toEqual([{ id: '2000' }, { id: 'abc' }]);
          expect([{ id: 'abc' }, { id: 'def' }].sort(sorting)).toEqual([{ id: 'abc' }, { id: 'def' }]);
          expect([{ id: 'def' }, { id: 'abc' }].sort(sorting)).toEqual([{ id: 'def' }, { id: 'abc' }]);
          expect([{ id: '2000' }, { id: 'abc' }].sort(sorting)).toEqual([{ id: '2000' }, { id: 'abc' }]);
          expect([{ id: '2000' }, { id: ' ' }].sort(sorting)).toEqual([{ id: '2000' }, { id: ' ' }]);
          expect([{ id: '2000' }, { id: '' }].sort(sorting)).toEqual([{ id: '2000' }, { id: '' }]);
        });

        it('should handle sorting with falsy value sorted normally', () => {
          const sorting = sort.array('date', 'id', 1, false);

          expect([{ id: 0 }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 0 }, { id: 1546300800000 }]);
          expect([{ id: null }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: null }, { id: 1546300800000 }]);
          expect([{ id: undefined }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: undefined }, { id: 1546300800000 }]);
          expect([{ id: NaN }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: NaN }, { id: 1546300800000 }]);
          expect([{ id: true }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: true }, { id: 1546300800000 }]);
          expect([{ id: false }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: false }, { id: 1546300800000 }]);
          expect([{ id: 0 }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 0 }, { id: 1546300800000 }]);
          expect([{ id: 1546300800000 }, { id: null }].sort(sorting)).toEqual([{ id: null }, { id: 1546300800000 }]);
          expect([{ id: 1546300800000 }, { id: undefined }].sort(sorting)).toEqual([{ id: undefined }, { id: 1546300800000 }]);
          expect([{ id: 1546300800000 }, { id: NaN }].sort(sorting)).toEqual([{ id: NaN }, { id: 1546300800000 }]);
          expect([{ id: 1546300800000 }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: 1546300800000 }]);
          expect([{ id: 1546300800000 }, { id: false }].sort(sorting)).toEqual([{ id: false }, { id: 1546300800000 }]);
          expect([{ id: '' }, { id: '2000' }].sort(sorting)).toEqual([{ id: '' }, { id: '2000' }]);
          expect([{ id: '2000' }, { id: '' }].sort(sorting)).toEqual([{ id: '' }, { id: '2000' }]);
        });
      });

      describe('DESC', () => {
        it('should handle sorting', () => {
          const sorting = sort.array('date', 'id', -1);

          expect([{ id: 1546300800000 }, { id: 1546300800001 }].sort(sorting)).toEqual([{ id: 1546300800001 }, { id: 1546300800000 }]);
          expect([{ id: 1546300800001 }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800001 }, { id: 1546300800000 }]);
          expect([{ id: '2000' }, { id: '1990' }].sort(sorting)).toEqual([{ id: '2000' }, { id: '1990' }]);
          expect([{ id: '2000-12' }, { id: '1990-12' }].sort(sorting)).toEqual([{ id: '2000-12' }, { id: '1990-12' }]);
          expect([{ id: '2000-12-31' }, { id: '1990-12-31' }].sort(sorting)).toEqual([{ id: '2000-12-31' }, { id: '1990-12-31' }]);
          expect([{ id: '1990-12-31T23:59' }, { id: '1991-01-01T00:00' }].sort(sorting)).toEqual([
            { id: '1991-01-01T00:00' },
            { id: '1990-12-31T23:59' },
          ]);
          expect([{ id: '1990-12-31T23:59:59' }, { id: '1991-01-01T00:00:00' }].sort(sorting)).toEqual([
            { id: '1991-01-01T00:00:00' },
            { id: '1990-12-31T23:59:59' },
          ]);
          expect([{ id: '1991-01-01T00:00:00' }, { id: '1990-12-31T23:59:59' }].sort(sorting)).toEqual([
            { id: '1991-01-01T00:00:00' },
            { id: '1990-12-31T23:59:59' },
          ]);
          expect([{ id: '1991-01-01T00:00' }, { id: '1990-12-31T23:59' }].sort(sorting)).toEqual([
            { id: '1991-01-01T00:00' },
            { id: '1990-12-31T23:59' },
          ]);
          expect([{ id: '2000-12-31' }, { id: '1990-12-31' }].sort(sorting)).toEqual([{ id: '2000-12-31' }, { id: '1990-12-31' }]);
          expect([{ id: '2000-12-31' }, { id: '1990-12-31' }].sort(sorting)).toEqual([{ id: '2000-12-31' }, { id: '1990-12-31' }]);
          expect([{ id: '2000-12' }, { id: '1990-12' }].sort(sorting)).toEqual([{ id: '2000-12' }, { id: '1990-12' }]);
          expect([{ id: '2000' }, { id: '1990' }].sort(sorting)).toEqual([{ id: '2000' }, { id: '1990' }]);
        });

        it('should handle sorting and leave identical values in original order', () => {
          const sorting = sort.array('date', 'id', -1);

          expect(
            [
              { id: 1546300800000, foo: 1 },
              { id: 1546300800000, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 1546300800000, foo: 1 },
            { id: 1546300800000, foo: 2 },
          ]);
          expect(
            [
              { id: '1990', foo: 1 },
              { id: '1990', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990', foo: 1 },
            { id: '1990', foo: 2 },
          ]);
          expect(
            [
              { id: '1990-12', foo: 1 },
              { id: '1990-12', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990-12', foo: 1 },
            { id: '1990-12', foo: 2 },
          ]);
          expect(
            [
              { id: '1990-12-31', foo: 1 },
              { id: '1990-12-31', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990-12-31', foo: 1 },
            { id: '1990-12-31', foo: 2 },
          ]);
          expect(
            [
              { id: '1990-12-31T23:59', foo: 1 },
              { id: '1990-12-31T23:59', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990-12-31T23:59', foo: 1 },
            { id: '1990-12-31T23:59', foo: 2 },
          ]);
          expect(
            [
              { id: '1990-12-31T23:59:59', foo: 1 },
              { id: '1990-12-31T23:59:59', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '1990-12-31T23:59:59', foo: 1 },
            { id: '1990-12-31T23:59:59', foo: 2 },
          ]);
        });

        it('should handle sorting with falsy values at the end by default', () => {
          const sorting = sort.array('date', 'id', -1);

          expect([{ id: 0 }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: 0 }]);
          expect([{ id: 1546300800000 }, { id: 0 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: 0 }]);
          expect([{ id: null }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: null }]);
          expect([{ id: undefined }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: undefined }]);
          expect([{ id: NaN }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: NaN }]);
          expect([{ id: true }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: true }]);
          expect([{ id: false }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: false }]);
          expect([{ id: '' }, { id: '2000' }].sort(sorting)).toEqual([{ id: '2000' }, { id: '' }]);
          expect([{ id: ' ' }, { id: '2000' }].sort(sorting)).toEqual([{ id: '2000' }, { id: ' ' }]);
          expect([{ id: 'abc' }, { id: '2000' }].sort(sorting)).toEqual([{ id: '2000' }, { id: 'abc' }]);
          expect([{ id: 'abc' }, { id: 'def' }].sort(sorting)).toEqual([{ id: 'abc' }, { id: 'def' }]);
          expect([{ id: 'def' }, { id: 'abc' }].sort(sorting)).toEqual([{ id: 'def' }, { id: 'abc' }]);
          expect([{ id: '2000' }, { id: 'abc' }].sort(sorting)).toEqual([{ id: '2000' }, { id: 'abc' }]);
          expect([{ id: '2000' }, { id: ' ' }].sort(sorting)).toEqual([{ id: '2000' }, { id: ' ' }]);
          expect([{ id: '2000' }, { id: '' }].sort(sorting)).toEqual([{ id: '2000' }, { id: '' }]);
        });

        it('should handle sorting with falsy value sorted normally', () => {
          const sorting = sort.array('date', 'id', -1, false);

          expect([{ id: 0 }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: 0 }]);
          expect([{ id: null }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: null }]);
          expect([{ id: undefined }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: undefined }]);
          expect([{ id: NaN }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: NaN }]);
          expect([{ id: true }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: true }]);
          expect([{ id: false }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: false }]);
          expect([{ id: 0 }, { id: 1546300800000 }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: 0 }]);
          expect([{ id: 1546300800000 }, { id: null }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: null }]);
          expect([{ id: 1546300800000 }, { id: undefined }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: undefined }]);
          expect([{ id: 1546300800000 }, { id: NaN }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: NaN }]);
          expect([{ id: 1546300800000 }, { id: true }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: true }]);
          expect([{ id: 1546300800000 }, { id: false }].sort(sorting)).toEqual([{ id: 1546300800000 }, { id: false }]);
          expect([{ id: '' }, { id: '2000' }].sort(sorting)).toEqual([{ id: '2000' }, { id: '' }]);
          expect([{ id: '2000' }, { id: '' }].sort(sorting)).toEqual([{ id: '2000' }, { id: '' }]);
        });
      });
    });

    describe('boolean', () => {
      describe('ASC', () => {
        it('should handle sorting', () => {
          const sorting = sort.array('boolean', 'id');

          expect([{ id: true }, { id: 100 }].sort(sorting)).toEqual([{ id: true }, { id: 100 }]);
          expect([{ id: true }, { id: 0 }].sort(sorting)).toEqual([{ id: true }, { id: 0 }]);
          expect([{ id: true }, { id: -20 }].sort(sorting)).toEqual([{ id: true }, { id: -20 }]);
          expect([{ id: true }, { id: 'a' }].sort(sorting)).toEqual([{ id: true }, { id: 'a' }]);
          expect([{ id: true }, { id: ' ' }].sort(sorting)).toEqual([{ id: true }, { id: ' ' }]);
          expect([{ id: true }, { id: '' }].sort(sorting)).toEqual([{ id: true }, { id: '' }]);
          expect([{ id: true }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: true }]);
          expect([{ id: true }, { id: false }].sort(sorting)).toEqual([{ id: true }, { id: false }]);
          expect([{ id: true }, { id: null }].sort(sorting)).toEqual([{ id: true }, { id: null }]);
          expect([{ id: true }, { id: undefined }].sort(sorting)).toEqual([{ id: true }, { id: undefined }]);
          expect([{ id: true }, { id: NaN }].sort(sorting)).toEqual([{ id: true }, { id: NaN }]);
          expect([{ id: true }, { id: {} }].sort(sorting)).toEqual([{ id: true }, { id: {} }]);
          expect([{ id: true }, { id: [] }].sort(sorting)).toEqual([{ id: true }, { id: [] }]);
          expect([{ id: 100 }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: 100 }]);
          expect([{ id: 0 }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: 0 }]);
          expect([{ id: -20 }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: -20 }]);
          expect([{ id: 'a' }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: 'a' }]);
          expect([{ id: ' ' }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: ' ' }]);
          expect([{ id: '' }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: '' }]);
          expect([{ id: true }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: true }]);
          expect([{ id: false }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: false }]);
          expect([{ id: null }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: null }]);
          expect([{ id: undefined }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: undefined }]);
          expect([{ id: NaN }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: NaN }]);
          expect([{ id: {} }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: {} }]);
          expect([{ id: [] }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: [] }]);
        });

        it('should handle sorting and leave identical values in original order', () => {
          const sorting = sort.array('date', 'id');

          expect(
            [
              { id: 100, foo: 1 },
              { id: 100, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 100, foo: 1 },
            { id: 100, foo: 2 },
          ]);
          expect(
            [
              { id: 0, foo: 1 },
              { id: 0, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0, foo: 1 },
            { id: 0, foo: 2 },
          ]);
          expect(
            [
              { id: -20, foo: 1 },
              { id: -20, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: -20, foo: 1 },
            { id: -20, foo: 2 },
          ]);
          expect(
            [
              { id: 'a', foo: 1 },
              { id: 'a', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'a', foo: 1 },
            { id: 'a', foo: 2 },
          ]);
          expect(
            [
              { id: ' ', foo: 1 },
              { id: ' ', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: ' ', foo: 1 },
            { id: ' ', foo: 2 },
          ]);
          expect(
            [
              { id: '', foo: 1 },
              { id: '', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '', foo: 1 },
            { id: '', foo: 2 },
          ]);
          expect(
            [
              { id: true, foo: 1 },
              { id: true, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: true, foo: 1 },
            { id: true, foo: 2 },
          ]);
          expect(
            [
              { id: false, foo: 1 },
              { id: false, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: false, foo: 1 },
            { id: false, foo: 2 },
          ]);
          expect(
            [
              { id: null, foo: 1 },
              { id: null, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: null, foo: 1 },
            { id: null, foo: 2 },
          ]);
          expect(
            [
              { id: undefined, foo: 1 },
              { id: undefined, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: undefined, foo: 1 },
            { id: undefined, foo: 2 },
          ]);
          expect(
            [
              { id: NaN, foo: 1 },
              { id: NaN, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: NaN, foo: 1 },
            { id: NaN, foo: 2 },
          ]);
          expect(
            [
              { id: {}, foo: 1 },
              { id: {}, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: {}, foo: 1 },
            { id: {}, foo: 2 },
          ]);
          expect(
            [
              { id: [], foo: 1 },
              { id: [], foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: [], foo: 1 },
            { id: [], foo: 2 },
          ]);
        });
      });

      describe('DESC', () => {
        it('should handle sorting', () => {
          const sorting = sort.array('boolean', 'id', -1);

          expect([{ id: true }, { id: 100 }].sort(sorting)).toEqual([{ id: 100 }, { id: true }]);
          expect([{ id: true }, { id: 0 }].sort(sorting)).toEqual([{ id: 0 }, { id: true }]);
          expect([{ id: true }, { id: -20 }].sort(sorting)).toEqual([{ id: -20 }, { id: true }]);
          expect([{ id: true }, { id: 'a' }].sort(sorting)).toEqual([{ id: 'a' }, { id: true }]);
          expect([{ id: true }, { id: ' ' }].sort(sorting)).toEqual([{ id: ' ' }, { id: true }]);
          expect([{ id: true }, { id: '' }].sort(sorting)).toEqual([{ id: '' }, { id: true }]);
          expect([{ id: true }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: true }]);
          expect([{ id: true }, { id: false }].sort(sorting)).toEqual([{ id: false }, { id: true }]);
          expect([{ id: true }, { id: null }].sort(sorting)).toEqual([{ id: null }, { id: true }]);
          expect([{ id: true }, { id: undefined }].sort(sorting)).toEqual([{ id: undefined }, { id: true }]);
          expect([{ id: true }, { id: NaN }].sort(sorting)).toEqual([{ id: NaN }, { id: true }]);
          expect([{ id: true }, { id: {} }].sort(sorting)).toEqual([{ id: {} }, { id: true }]);
          expect([{ id: true }, { id: [] }].sort(sorting)).toEqual([{ id: [] }, { id: true }]);
          expect([{ id: 100 }, { id: true }].sort(sorting)).toEqual([{ id: 100 }, { id: true }]);
          expect([{ id: 0 }, { id: true }].sort(sorting)).toEqual([{ id: 0 }, { id: true }]);
          expect([{ id: -20 }, { id: true }].sort(sorting)).toEqual([{ id: -20 }, { id: true }]);
          expect([{ id: 'a' }, { id: true }].sort(sorting)).toEqual([{ id: 'a' }, { id: true }]);
          expect([{ id: ' ' }, { id: true }].sort(sorting)).toEqual([{ id: ' ' }, { id: true }]);
          expect([{ id: '' }, { id: true }].sort(sorting)).toEqual([{ id: '' }, { id: true }]);
          expect([{ id: true }, { id: true }].sort(sorting)).toEqual([{ id: true }, { id: true }]);
          expect([{ id: false }, { id: true }].sort(sorting)).toEqual([{ id: false }, { id: true }]);
          expect([{ id: null }, { id: true }].sort(sorting)).toEqual([{ id: null }, { id: true }]);
          expect([{ id: undefined }, { id: true }].sort(sorting)).toEqual([{ id: undefined }, { id: true }]);
          expect([{ id: NaN }, { id: true }].sort(sorting)).toEqual([{ id: NaN }, { id: true }]);
          expect([{ id: {} }, { id: true }].sort(sorting)).toEqual([{ id: {} }, { id: true }]);
          expect([{ id: [] }, { id: true }].sort(sorting)).toEqual([{ id: [] }, { id: true }]);
        });

        it('should handle sorting and leave identical values in original order', () => {
          const sorting = sort.array('date', 'id', -1);

          expect(
            [
              { id: 100, foo: 1 },
              { id: 100, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 100, foo: 1 },
            { id: 100, foo: 2 },
          ]);
          expect(
            [
              { id: 0, foo: 1 },
              { id: 0, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 0, foo: 1 },
            { id: 0, foo: 2 },
          ]);
          expect(
            [
              { id: -20, foo: 1 },
              { id: -20, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: -20, foo: 1 },
            { id: -20, foo: 2 },
          ]);
          expect(
            [
              { id: 'a', foo: 1 },
              { id: 'a', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: 'a', foo: 1 },
            { id: 'a', foo: 2 },
          ]);
          expect(
            [
              { id: ' ', foo: 1 },
              { id: ' ', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: ' ', foo: 1 },
            { id: ' ', foo: 2 },
          ]);
          expect(
            [
              { id: '', foo: 1 },
              { id: '', foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: '', foo: 1 },
            { id: '', foo: 2 },
          ]);
          expect(
            [
              { id: true, foo: 1 },
              { id: true, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: true, foo: 1 },
            { id: true, foo: 2 },
          ]);
          expect(
            [
              { id: false, foo: 1 },
              { id: false, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: false, foo: 1 },
            { id: false, foo: 2 },
          ]);
          expect(
            [
              { id: null, foo: 1 },
              { id: null, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: null, foo: 1 },
            { id: null, foo: 2 },
          ]);
          expect(
            [
              { id: undefined, foo: 1 },
              { id: undefined, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: undefined, foo: 1 },
            { id: undefined, foo: 2 },
          ]);
          expect(
            [
              { id: NaN, foo: 1 },
              { id: NaN, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: NaN, foo: 1 },
            { id: NaN, foo: 2 },
          ]);
          expect(
            [
              { id: {}, foo: 1 },
              { id: {}, foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: {}, foo: 1 },
            { id: {}, foo: 2 },
          ]);
          expect(
            [
              { id: [], foo: 1 },
              { id: [], foo: 2 },
            ].sort(sorting)
          ).toEqual([
            { id: [], foo: 1 },
            { id: [], foo: 2 },
          ]);
        });
      });
    });

    describe('customSort', () => {
      it('parameter is not array return same order array', () => {
        const useArray = 'not array';
        const sorting = sort.array('customSort', 'statusId', '', true, useArray);

        expect([{ statusId: 3 }, { statusId: 1 }, { statusId: 2 }].sort(sorting)).toEqual([
          { statusId: 3 },
          { statusId: 1 },
          { statusId: 2 },
        ]);
      });

      it('sort/group by array', () => {
        const useArray = [2, 1, 3];
        const sorting = sort.array('customSort', 'statusId', '', true, useArray);

        expect([{ statusId: 3 }, { statusId: 1 }, { statusId: 2 }].sort(sorting)).toEqual([
          { statusId: 2 },
          { statusId: 1 },
          { statusId: 3 },
        ]);

        expect([{ statusId: 1 }, { statusId: 3 }, { statusId: 2 }, { statusId: 1 }, { statusId: 2 }].sort(sorting)).toEqual([
          { statusId: 2 },
          { statusId: 2 },
          { statusId: 1 },
          { statusId: 1 },
          { statusId: 3 },
        ]);

        expect([{ statusId: 3 }, { statusId: 3 }, { statusId: 2 }, { statusId: 1 }, { statusId: 2 }].sort(sorting)).toEqual([
          { statusId: 2 },
          { statusId: 2 },
          { statusId: 1 },
          { statusId: 3 },
          { statusId: 3 },
        ]);
      });
    });
  });
});
