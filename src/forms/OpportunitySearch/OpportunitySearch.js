import React from 'react';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';

// app
import { OpportunitySearchView } from './OpportunitySearch.view';
import { getTripAddresses, getTripLeads, resetTripLeads } from 'stores';

export default function OpportunitySearch() {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'addresses',
      type: 'autocomplete',
      value: [],
      options: [],
      optionKey: 'id',
      optionLabel: 'outputAddress',
      innerComponentProps: {
        allowEmpty: true,
        async: {
          handler: (type, term) => dispatch(getTripAddresses(term)),
          type: 'addresses',
        },
      },
      callback: (value) => {
        const lat = (value ? get(value, '[0].lat') : null) || null;
        const lng = (value ? get(value, '[0].lng') : null) || null;

        if (lat && lng) {
          dispatch(getTripLeads(lat, lng));
        } else {
          dispatch(resetTripLeads());
        }
      },
    },
  ];

  return <OpportunitySearchView fields={fields} />;
}
