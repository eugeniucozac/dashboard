import React from 'react';

// app
import { Layout } from 'components';
import { ModellingList } from 'modules';

export function ModellingView() {
  return (
    <Layout testid="modelling">
      <Layout main>
        <ModellingList displayAutocomplete={true} />
      </Layout>
    </Layout>
  );
}
