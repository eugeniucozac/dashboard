// this is to force the new Date() to always use UTC timezone for testing purpose
// without this, some expectations would fail when executed in different timezone
//
// ex:
// new Date('2018') --> 2018 if the OS system date is set to UK
// new Date('2018') --> 2017 if the OS system date is set to Canada (eastern time zone)
module.exports = async () => {
  process.env.TZ = 'UTC';
};
