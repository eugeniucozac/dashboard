import React, { useState } from 'react';
import PropTypes from 'prop-types';

// app
import { FormCheckbox, TableCell, PopoverMenu, Tooltip, Skeleton } from 'components';
import { DmsDocDetailsTooltip } from 'modules';
import * as utils from 'utils';
import config from 'config';

// mui
import { Table, TableBody, TableRow } from '@material-ui/core';

ClaimsManageDocumentsTable.propTypes = {
  documents: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  allFields: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  popoverActions: PropTypes.array.isRequired,
  isDmsFileViewGridDataLoading: PropTypes.bool,
  handlers: PropTypes.shape({
    formStatus: PropTypes.func.isRequired,
    setSelectAll: PropTypes.func.isRequired,
    viewDocLauncher: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsManageDocumentsTable({
  documents,
  control,
  register,
  watch,
  fields,
  allFields,
  cols,
  popoverActions,
  isDmsFileViewGridDataLoading,
  handlers,
}) {
  const selectedGroups = fields?.filter((item) => !!item?.defaultValue === true)?.map((item) => item?.name) || [];
  const [selectedGxbDocs, setSelectedGxbDocs] = useState(!utils.generic.isInvalidOrEmptyArray(selectedGroups) ? selectedGroups : []);

  const checkedDocs = (e, docs) => {
    e.stopPropagation();
    let checkedDocument = docs?.checked ? [...selectedGxbDocs, docs?.id] : selectedGxbDocs?.filter((item) => item !== docs?.id);
    let allFieldsSelected = checkedDocument?.length === allFields?.length;
    setSelectedGxbDocs(checkedDocument);
    handlers.setSelectAll(allFieldsSelected);
    handlers.formStatus();
  };

  return (
    <Table size="small">
      <TableBody>
        {isDmsFileViewGridDataLoading ? (
          <TableRow>
            <TableCell colSpan={cols.length}>
              <Skeleton height={40} animation="wave" displayNumber={4} />
            </TableCell>
          </TableRow>
        ) : (
          documents?.map((doc, ind) => {
            const updatedPopOverActions = doc?.isLinkedToMultipleContexts
              ? [...popoverActions].map((action) => {
                  const isDeleteAction = action.id === 'delete';
                  return isDeleteAction ? { ...action, disabled: true } : action;
                })
              : [...popoverActions];

            const actionDescId = doc?.documentId.toString();

            return (
              <TableRow key={ind} hover style={{ cursor: 'pointer' }} onClick={(e) => handlers.viewDocLauncher(e, doc)}>
                <TableCell>
                  <FormCheckbox
                    name={actionDescId}
                    {...utils.form.getFieldProps(fields, actionDescId)}
                    control={control}
                    register={register}
                    watch={watch}
                    muiComponentProps={{
                      onClick: (e) => checkedDocs(e, { id: e.target.name, checked: e.target.checked }),
                    }}
                  />
                </TableCell>
                <TableCell compact minimal>
                  <Tooltip title={<DmsDocDetailsTooltip data={doc} />} placement={'bottom'} arrow>
                    {doc?.documentName}
                  </Tooltip>
                </TableCell>
                <TableCell compact minimal>
                  {doc?.createdByName}
                </TableCell>
                <TableCell compact minimal>
                  {utils.string.t('format.date', { value: { date: doc?.createdDate, format: config.ui.format.date.text } })}
                </TableCell>
                <TableCell>
                  <PopoverMenu
                    id="view-menu-list"
                    items={updatedPopOverActions}
                    data={{ doc }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
