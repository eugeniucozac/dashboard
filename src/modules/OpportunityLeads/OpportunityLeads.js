import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import xor from 'lodash/xor';

// app
import { OpportunityLeadsView } from './OpportunityLeads.view';

OpportunityLeads.propTypes = {
  leads: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  handleClickCheckbox: PropTypes.func.isRequired,
  handleClickLead: PropTypes.func.isRequired,
};

export default function OpportunityLeads({ leads, selected, handleClickCheckbox, handleClickLead }) {
  const tripLeadsLoading = useSelector((state) => state.trip.leadsLoading);
  const tripLeadsEmpty = useSelector((state) => state.trip.leadsEmpty);
  const tripSelected = useSelector((state) => state.trip.selected);
  const tripEditingInProgress = useSelector((state) => state.trip.editingInProgress);
  const trip = tripSelected.editing ? { ...tripSelected, ...tripEditingInProgress } : tripSelected;
  const [expanded, setExpanded] = useState([]);

  const handleClickLeadExisting = (id) => (event) => {
    event.stopPropagation();
    setExpanded(xor(expanded, [id]));
  };

  return (
    <OpportunityLeadsView
      trip={trip}
      leads={leads}
      leadsLoading={tripLeadsLoading}
      leadsEmpty={tripLeadsEmpty}
      expanded={expanded}
      selected={selected}
      handleClickLead={handleClickLead}
      handleClickLeadExisting={handleClickLeadExisting}
      handleClickCheckbox={handleClickCheckbox}
    />
  );
}
