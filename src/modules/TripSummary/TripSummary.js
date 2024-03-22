import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import pick from 'lodash/pick';
import get from 'lodash/get';

// app
import { TripSummaryView } from './TripSummary.view';
import { editTripDetails, editTripVisit, postTrip, putTrip, toggleTripVisit, showModal } from 'stores';
import { useMedia } from 'hooks';
import * as utils from 'utils';
import config from 'config';

export default function TripSummary() {
  const media = useMedia();
  const history = useHistory();
  const dispatch = useDispatch();
  const trip = useSelector((store) => get(store, 'trip.selected') || {});
  const tripEditing = useSelector((store) => get(store, 'trip.selected.editing'));
  const tripTitle = useSelector((store) => (tripEditing ? get(store, 'trip.editingInProgress.title') : get(store, 'trip.selected.title')));
  const tripVisits = useSelector((store) =>
    tripEditing ? get(store, 'trip.editingInProgress.visits') : get(store, 'trip.selected.visits', [])
  );

  const [map, setMap] = useState({
    maxZoom: 12,
    activeMarkers: [],
  });

  const [inlineEditingFields, setInlineEditingFields] = useState({ title: false });
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // abort
    if (!utils.generic.isValidArray(tripVisits, true)) {
      return;
    }

    setLocations(
      tripVisits.map((visit) => {
        return {
          ...visit,
          ...pick(get(visit, 'location.geocodeResult', {}), ['lat', 'lng', 'outputAddress', 'locationsFound']),
        };
      })
    );
  }, [tripVisits]);

  // when the selected trip changes, reset the inline editing to false
  useEffect(() => {
    setInlineEditingFields({ title: false });
  }, [trip.id]);

  const handleClickMarker = (location) => {
    if (!location || !location.id) return;

    setMap({ ...map, activeMarkers: [location.id] });
  };

  const handleClickLead = (lead) => (event) => {
    const marker = map.markers.find((m) => {
      return m.location.id === lead.id;
    });

    // trigger on marker click to initiate the map flyTo/zoom animation and open popup if defined
    if (marker && marker.getElement()) {
      marker.getElement().click();
    }
  };

  const handleClickEditTitle = (event) => {
    setInlineEditingFields({
      ...inlineEditingFields,
      title: true,
    });
  };

  const handleClickAwayEditTitle = (value, error, dirty, validateForm, submitForm, setFieldValue, inlineEditMode) => (event) => {
    const isTitleIdentical = tripTitle === value;
    const newValue = value ? value.trim() : '';

    // if no change were made: do nothing (except reset inline edit)
    if (isTitleIdentical) {
      if (inlineEditMode) {
        setInlineEditingFields({ ...inlineEditingFields, title: false });
      }

      return;
    }

    // in create mode, save all changes to trip title
    if (!inlineEditMode) {
      setFieldValue('title', newValue);
      dispatch(editTripDetails({ title: newValue }));
    }

    // in edit mode, only save changes (and reset inline editing) if there's no error
    if (inlineEditMode && !error) {
      setFieldValue('title', newValue);
      dispatch(editTripDetails({ title: newValue }));

      setInlineEditingFields({
        ...inlineEditingFields,
        title: false,
      });

      dispatch(putTrip());
    }

    // trigger form validation to display
    if (dirty && error && utils.generic.isFunction(submitForm)) {
      submitForm();
    }
  };

  const handleEditVisit = (data, inlineEditMode) => {
    if (!data) return;

    dispatch(editTripVisit(data));

    if (inlineEditMode) {
      dispatch(putTrip());
    }
  };

  const handleClickRemoveVisit = ({ visit, inlineEditMode }) => {
    if (!visit || !visit.id) return;

    dispatch(toggleTripVisit(visit));

    if (inlineEditMode) {
      dispatch(putTrip());
    }
  };

  const handleEditBrokersClick = (popoverData) => {
    dispatch(
      showModal({
        component: 'EDIT_TRIP_BROKERS',
        props: {
          title: 'opportunity.addRemoveBrokers',
          subtitle: utils.string.t('opportunity.addRemoveBrokersHint', { visit: get(popoverData, 'visit.client.name') }),
          fullWidth: true,
          maxWidth: 'sm',
          componentProps: { ...popoverData },
        },
      })
    );
  };

  const handleSaveTrip = (inlineEditMode) => {
    const saveMethod = inlineEditMode ? putTrip : postTrip;

    dispatch(saveMethod()).then(() => {
      history.push(config.routes.trip.root);
    });
  };

  const handleSubmit = (submitForm, validateForm) => () => {
    const allVisitsHaveUsers = tripVisits.every((visit) => {
      return utils.generic.isValidArray(visit.users, true);
    });

    if (allVisitsHaveUsers) {
      submitForm();
    } else {
      validateForm();
    }
  };

  const handleOnLoad = (instance, { markers }) => {
    if (!instance || !markers) return;

    setMap({ ...map, instance, markers });
  };

  const handleOnChange = (markers) => {
    if (!markers) return;

    setMap({ ...map, markers });
  };

  return (
    <TripSummaryView
      trip={{
        ...trip,
        title: tripTitle,
      }}
      visits={locations}
      map={map}
      isExisting={Boolean(trip && trip.id)}
      inlineEditMode={!trip.editing}
      inlineEditingFields={inlineEditingFields}
      mobile={media.mobile}
      tablet={media.tablet}
      desktop={media.desktop}
      wide={media.wide}
      handleClickLead={handleClickLead}
      handleClickMarker={handleClickMarker}
      handleEditVisit={handleEditVisit}
      handleClickRemoveVisit={handleClickRemoveVisit}
      handleEditBrokersClick={handleEditBrokersClick}
      handleClickEditTitle={handleClickEditTitle}
      handleClickAwayEditTitle={handleClickAwayEditTitle}
      handleSaveTrip={handleSaveTrip}
      handleSubmit={handleSubmit}
      handleOnLoad={handleOnLoad}
      handleOnChange={handleOnChange}
    />
  );
}
