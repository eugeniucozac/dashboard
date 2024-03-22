import React from 'react';
import PropTypes from 'prop-types';

//app
import { AccessControl, Layout, SectionHeader, Translate } from 'components';
import * as utils from 'utils';
import { ProcessingInstructionsList } from 'modules';

//mui
import ViewListIcon from '@material-ui/icons/ViewList';

ProcessingInstructionsView.propTypes = {
  gridData: PropTypes.shape({
    items: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    itemsTotal: PropTypes.number.isRequired,
  }).isRequired,
  processTypes: PropTypes.arrayOf(
    PropTypes.shape({
      processTypeID: PropTypes.number.isRequired,
      processTypeDetails: PropTypes.string.isRequired,
    })
  ).isRequired,
  departments: PropTypes.array.isRequired,
  statuses: PropTypes.array.isRequired,
};

export function ProcessingInstructionsView({ gridData, processTypes, departments, statuses }) {
  return (
    <Layout testid="processing-instructions" extensiveScreens>
      <Layout main padding>
        <SectionHeader
          title={<Translate label={utils.string.t('processingInstructions.title')} />}
          icon={ViewListIcon}
          testid="processing-instructions"
        />
        <AccessControl feature="processingInstructions.processingInstructions" permissions="read">
          <ProcessingInstructionsList gridData={gridData} processTypes={processTypes} departments={departments} statuses={statuses} />
        </AccessControl>
      </Layout>
    </Layout>
  );
}
