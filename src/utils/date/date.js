import moment from 'moment';
import { WEEKOFF_DAYS } from 'consts';

const utilsDate = {
  toISOString: (date) => {
    return moment(date).toISOString();
  },
  formatDate: (format = 'YYYY-MM-DD') => {
    return moment().format(format);
  },
  formatISO: (date) => {
    // input:   dd/mm/yyyy hh:mm:ss  (date format from API endpoints)
    // output:  yyyy-mm-dd hh:mm:ss  (moment expects ISO 8601 date format)
    // this method transforms the dates so that JS/moment can handle them

    // quit if date is not defined
    if (!date || date.length <= 0) return date;

    const partDate = date.toString().split(/[\sT]+/)[0];
    const partTime = date.toString().split(/[\sT]+/)[1];

    // quit if date part doesn't have day, month and year
    if (partDate.split('/').length < 3) return date;

    const partDay = partDate.split('/')[0];
    const partMonth = partDate.split('/')[1];
    const partYear = partDate.split('/')[2];

    return partYear + '-' + partMonth + '-' + partDay + (partTime ? ' ' + partTime : '');
  },

  fromNow: (date, translations) => {
    const fromNow = moment(date).fromNow();

    // TODO added on 13/11/2019: add default translations

    return moment(date).calendar(null, {
      sameDay: () => `[${fromNow}]`,
      lastWeek: () => `[${fromNow}]`,
      lastDay: `[${translations.yesterday || 'Yesterday'}]`,
      nextDay: `[${translations.tomorrow || 'Tomorrow'}]`,
      nextWeek: () => `[${fromNow}]`,
      sameElse: () => `[${fromNow}]`,
    });
  },

  timestamp: (date) => {
    // abort
    if (!date || date.length <= 0) return 0;

    const newDate = date && new Date(date);
    const timestamp = newDate && newDate.getTime();

    return timestamp || 0;
  },

  today: (format = 'YYYY-MM-DD') => {
    return moment().format(format);
  },
  tomorrow: () => {
    return moment().add(1, 'days');
  },
  monthDetails: (date, format = 'YYYY-MM-DD') => {
    return {
      monthName: moment(date).format('MMMM'),
      month: moment(date).format('M'),
      year: moment(date).format('YYYY'),
      date: moment(date).format(format),
    };
  },
  previousMonth: (date) => {
    const startLastMonth = moment(date).subtract(1, 'months').startOf('month');

    return utilsDate.monthDetails(startLastMonth);
  },
  nextMonth: (date) => {
    const startNextMonth = moment(date).add(1, 'months').startOf('month');

    return utilsDate.monthDetails(startNextMonth);
  },

  diffDays: (firstDate, secondDate) => {
    return moment(firstDate).diff(moment(secondDate), 'days');
  },

  datePercent: (startDate, endDate, currentDate) => {
    const mStart = moment(startDate);
    const mEnd = moment(endDate);
    const mData = moment(currentDate);

    const percentile = (100.0 * mData.diff(mStart)) / mEnd.diff(mStart);

    return percentile;
  },
  isBefore: (date) => {
    return moment(date).isBefore(moment());
  },

  getTargetBusinessDays: (date, days) => {
    const currentDate = new Date(date);
    const newDate = moment(new Date(currentDate.setDate(currentDate.getDate() + days)));
    return newDate.weekday() === WEEKOFF_DAYS.sun.weekday
      ? newDate.add(WEEKOFF_DAYS.sun.addDays, 'd')
      : newDate.weekday() === WEEKOFF_DAYS.sat.weekday
      ? newDate.add(WEEKOFF_DAYS.sat.addDays, 'd')
      : newDate;
  },
};

export default utilsDate;
