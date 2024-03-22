import React from 'react';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Beforeunload } from 'react-beforeunload';

PreventNavigationView.propTypes = {
  dirty: PropTypes.bool,
};

export function PreventNavigationView({ dirty, handleInternalNavigation }) {
  return (
    <>
      <Prompt when={dirty} message={handleInternalNavigation} />
      {dirty && <Beforeunload onBeforeunload={(event) => event.preventDefault()} />}
    </>
  );
}
