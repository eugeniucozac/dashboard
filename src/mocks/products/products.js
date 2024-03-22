const products = {
  status: 'success',
  data: [
    {
      label: 'Nasco / Medical - General',
      value: 'NASCO_GENERAL',
      status: 'ERROR',
      message: 'All facilities for the given product have not been setup with the required commission rates',
    },
    {
      label: 'Hub International - Canadian Property',
      value: 'CAN_RES_PROP',
      status: 'ERROR',
      message: 'All facilities for the given product have not been setup with the required commission rates',
    },
    {
      label: 'EPIC - Terror Property',
      value: 'EPIC_TERROR_PROP',
      status: 'ERROR',
      message: 'All facilities for the given product have not been setup with the required commission rates',
    },
    {
      label: 'MarketScout - US Residential',
      value: 'US_RES_PROP',
      status: 'ERROR',
    },
    {
      label: 'Wind & Hail Deductible Buyback',
      value: 'WIND_HAIL_DBB',
      status: 'WARN',
      message:
        'One or more facilities for the given product have not been setup with the required commission rates. A risk may still be created but carrier choice may be impacted.',
    },
    {
      label: 'Follow Only',
      value: 'FOLLOW_ONLY',
      status: 'OK',
    },
    {
      label: 'Chubb - Aviation v1',
      value: 'AVIATION',
      status: 'ERROR',
      message: 'All facilities for the given product have not been setup with the required commission rates',
    },
    {
      label: 'Fixed Wing General Aviation',
      value: 'AVIATION_FIXED_WING',
      status: 'ERROR',
      message: 'All facilities for the given product have not been setup with the required commission rates',
    },
    {
      label: 'Cross-Class Follow',
      value: 'BEAZLEY_CARGO_V1',
      status: 'ERROR',
      message: 'All facilities for the given product have not been setup with the required commission rates',
    },
  ],
};

export default products;
