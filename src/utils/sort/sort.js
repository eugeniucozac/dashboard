import numbro from 'numbro';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';

// app
import * as utils from 'utils';

const utilsSort = {
  array: (type, prop, direction = 'asc', nullAtEnd = true, sortArray) => {
    const dir = getDirection(direction);

    switch (type) {
      case 'date':
        return date(prop, dir, nullAtEnd);
      case 'numeric':
        return numeric(prop, dir, nullAtEnd);
      case 'boolean':
        return boolean(prop, dir, nullAtEnd);
      case 'customSort':
        return customSort(prop, sortArray);
      default:
        return lexical(prop, dir, nullAtEnd);
    }
  },
  arrayNestedPropertyValue: (arr, prop, dir = 'asc') => {
    return orderBy(
      arr,
      [
        function (item) {
          return get(item, prop);
        },
      ],
      [dir]
    );
  },
};

// customSort - based on sortArray values
const customSort = (prop, sortArray) => {
  if (utils.generic.isInvalidOrEmptyArray(sortArray)) return;

  return (a, b) => sortArray.indexOf(a[prop]) - sortArray.indexOf(b[prop]);
};
const numeric = (prop, direction = 1, nullAtEnd = true) => {
  const dir = getDirection(direction);

  return (a, b) => {
    const aa = numbro.unformat(a[prop]);
    const bb = numbro.unformat(b[prop]);

    // move falsy values (excl. zero (0)) at the end
    const isFalsyA = aa === false || aa === null || aa === undefined || aa === '';
    const isFalsyB = bb === false || bb === null || bb === undefined || bb === '';
    const moveNullAtEnd = nullAtEnd ? isFalsyA - isFalsyB : false;

    // return moveNullAtEnd || +(aa > bb) * dir || -(aa < bb) * dir;
    return moveNullAtEnd || dir * (aa - bb);
  };
};

const boolean = (prop, direction = 1) => {
  // anything other than true is treated as false
  // the order is: true > false AND/OR anything else...
  const order = [true, false];
  const dir = getDirection(direction);

  return (a, b) => {
    const aa = order.indexOf(a[prop]) >= 0 ? order.indexOf(a[prop]) : 1;
    const bb = order.indexOf(b[prop]) >= 0 ? order.indexOf(b[prop]) : 1;
    return dir * (aa - bb);
  };
};

const date = (prop, direction = 1, nullAtEnd = true) => {
  // date values should be:
  //    - timestamps: 1546300800000
  //    - date string: '2010-12'
  //    - date string: '2010-12-31'
  //    - date string: '2010-12-31T23:59'
  //    - date string: '2010-12-31T23:59:59'
  const dir = getDirection(direction);

  return (a, b) => {
    const aTimestamp = new Date(a[prop]).getTime();
    const bTimestamp = new Date(b[prop]).getTime();

    // cast to 0 anything that's not a valid timestamp
    const aa = Boolean(aTimestamp) ? aTimestamp : 0;
    const bb = Boolean(bTimestamp) ? bTimestamp : 0;

    // move falsy values at the end
    // negative timestamps are supported
    // anything other than 0 and 1 is a valid timestamp
    // 0 would be returned by new Date(false)
    // 1 would be returned by new Date(true)
    // even though both values are valid timestamp, we exclude them
    const isFalsyA = !(aa < 0 || aa > 1);
    const isFalsyB = !(bb < 0 || bb > 1);
    const moveNullAtEnd = nullAtEnd ? isFalsyA - isFalsyB : false;

    return moveNullAtEnd || dir * (aa - bb);
  };
};

const lexical = (prop, direction = 1, nullAtEnd = true) => {
  const dir = getDirection(direction);

  return (a, b) => {
    const aa = a[prop] ? a[prop].toString().toLowerCase().trim() : '';
    const bb = b[prop] ? b[prop].toString().toLowerCase().trim() : '';

    const isFalsyA = aa === null || aa === undefined || aa === '';
    const isFalsyB = bb === null || bb === undefined || bb === '';

    if (nullAtEnd) {
      if (isFalsyA && isFalsyB) {
        return 0;
      } else if (isFalsyA) {
        return dir ? 1 : -1;
      } else if (isFalsyB) {
        return dir ? -1 : 1;
      }
    }

    if (bb > aa) return dir * -1;
    if (bb < aa) return dir * 1;
    return 0;
  };
};

const getDirection = (dir) => {
  return dir === -1 || dir === 'desc' ? -1 : 1;
};

export default utilsSort;
