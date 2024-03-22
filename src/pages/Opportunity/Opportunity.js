import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import pick from 'lodash/pick';
import toNumber from 'lodash/toNumber';
import unionBy from 'lodash/unionBy';

// app
import { OpportunityView } from './Opportunity.view';
import {
  enqueueNotification,
  resetTripSelected,
  toggleTripVisit,
  getTripById,
  resetTripEditingInProgress,
  resetTripLeads,
  toggleTripEditing,
} from 'stores';
import * as utils from 'utils';
import config from 'config';

export default function Opportunity() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const brand = useSelector((state) => state.ui.brand);
  const user = useSelector((state) => state.user);
  const tripLeads = useSelector((state) => state.trip.leads);
  const tripSelected = useSelector((state) => state.trip.selected);
  const tripEditingInProgress = useSelector((state) => state.trip.editingInProgress);
  const trip = tripSelected.editing ? { ...tripSelected, ...tripEditingInProgress } : tripSelected;

  // state
  const [map, setMap] = useState({
    maxZoom: 12,
    activeMarkers: [],
  });

  useEffect(
    () => {
      dispatch(toggleTripEditing(true));

      if (trip.id && (!id || toNumber(id) !== trip.id)) {
        dispatch(resetTripSelected());
      }

      if (id && toNumber(id) !== trip.id) {
        dispatch(getTripById(id, false)).then((res) => {
          if (!res || !res.id || res.status === 'error') {
            history.replace(config.routes.trip.root);
            dispatch(enqueueNotification('notification.getTrip.fail', 'warning', { data: { id: id } }));
          }
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, trip.id]
  );

  useEffect(() => {
    // cleanup
    return () => {
      dispatch(resetTripLeads());
      dispatch(resetTripEditingInProgress());
      dispatch(toggleTripEditing(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseLocations = (locations) => {
    if (!utils.generic.isValidArray(locations, true)) return [];

    return locations.map((l) => {
      return {
        ...l,
        ...pick(l.geocodeResult, ['lat', 'lng', 'outputAddress', 'locationsFound']),
      };
    });
  };

  const handleClickCheckbox = (lead, visit) => (event) => {
    event.stopPropagation();

    dispatch(
      toggleTripVisit(
        {
          id: lead.id, // will be overwritten by visit.id below if it is an existing visit
          client: lead.client,
          location: lead,
          users: [user],
          isNewVisit: true,
          ...(visit &&
            visit.id && {
              ...visit,
              isExistingLeadVisit: true,
              users: unionBy(visit.users, [user], 'id'),
            }),
        },
        true
      )
    );
  };

  const handleClickLead = (lead) => (event) => {
    if (!lead || !lead.id) return;

    const marker = map.markers.find((m) => {
      return m.location.id === lead.id;
    });

    // trigger on marker click to initiate the map flyTo/zoom animation and open popup if defined
    if (marker && marker.getElement()) {
      marker.getElement().click();
    }
  };

  const handleClickMarker = (location) => {
    if (!location || !location.id) return;

    setMap({ ...map, activeMarkers: [location.id] });
  };

  const handleOnLoad = (instance, { markers }) => {
    if (!instance || !markers) return;

    setMap({ ...map, instance, markers });
  };

  const handleOnChange = (markers) => {
    if (!markers) return;

    setMap({ ...map, markers });
  };

  const leads = parseLocations(tripLeads);

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('opportunity.title')}${trip.title ? ` - ${trip.title}` : ''} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>

      <OpportunityView
        leads={leads}
        map={map}
        handleClickCheckbox={handleClickCheckbox}
        handleClickLead={handleClickLead}
        handleClickMarker={handleClickMarker}
        handleOnLoad={handleOnLoad}
        handleOnChange={handleOnChange}
      />
    </>
  );
}
