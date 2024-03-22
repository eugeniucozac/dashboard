import React from 'react';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import { Accordion } from 'components';
import { ClaimsUploadViewSearchDocs } from 'modules';
import styles from './RfiResponseDms.styles';
import * as constants from 'consts';

//mui
import { makeStyles } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

RfiResponseDmsView.prototype = {
  task: PropTypes.object,
  expanded: PropTypes.bool,
  toggleDmsSection: PropTypes.func,
  viewOptions: PropTypes.shape({
    disabled: PropTypes.bool,
    upload: PropTypes.bool,
    search: PropTypes.bool,
    unlink: PropTypes.bool,
    delete: PropTypes.bool,
  }).isRequired,
};

export function RfiResponseDmsView({ task, expanded, toggleDmsSection, viewOptions }) {
  const classes = makeStyles(styles, { name: 'RfiResponseDms' })({ expanded });

  return (
    <div className={classes.root}>
      <Accordion
        icon={false}
        expanded={expanded}
        actions={[
          {
            id: 'manageDocs',
            text: viewOptions.readOnly ? utils.string.t('dms.wrapper.viewDocuments') : utils.string.t('dms.wrapper.manageDocuments'),
            icon: KeyboardArrowUpIcon,
            iconPosition: 'left',
            color: 'primary',
            onClick: toggleDmsSection,
            nestedClasses: {
              link: classes.toggleBtnLink,
              icon: classes.toggleBtnIcon,
            },
          },
        ]}
      >
        <div container className={classes.dmsWrapper}>
          <ClaimsUploadViewSearchDocs
            refData={task}
            refIdName={constants.DMS_CONTEXT_TASK_ID}
            dmsContext={constants.DMS_CONTEXT_TASK}
            viewOptions={{
              upload: viewOptions.upload,
            }}
            searchOptions={{
              disabled: true,
            }}
            documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim}
          />
        </div>
      </Accordion>
    </div>
  );
}
