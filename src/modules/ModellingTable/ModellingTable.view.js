import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import * as constants from 'consts';
import styles from './ModellingTable.styles';
import { Status, TableCell, TableHead, Translate, PopoverMenu, DocumentTable } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { Table, TableRow, TableBody, makeStyles } from '@material-ui/core';

ModellingTableView.propTypes = {
  selectedId: PropTypes.number,
  modellingList: PropTypes.array.isRequired,
  handleClickRow: PropTypes.func.isRequired,
  sort: PropTypes.shape({
    by: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }),
  cols: PropTypes.array.isRequired,
  popoverActions: PropTypes.array.isRequired,
};

export function ModellingTableView({ selectedId, popoverActions, modellingList = [], handleClickRow, sort, cols }) {
  const classes = makeStyles(styles, { name: 'ModellingTable' })();

  const tableRowClasses = {
    [classes.hover]: handleClickRow && utils.generic.isFunction(handleClickRow),
  };

  return (
    <Table size="small">
      <TableHead columns={cols} sorting={sort} />
      <TableBody data-testid="modelling-list">
        {modellingList.map((modellingTask, index) => (
          <Fragment key={`modelling-table-row-${index}`}>
            <TableRow
              onClick={() => handleClickRow(modellingTask.id)}
              className={classnames(tableRowClasses, { [classes.selectedRow]: selectedId === modellingTask.id })}
              hover
              data-testid={`modelling-row-${modellingTask.id}`}
            >
              <TableCell nestedClasses={{ root: classes.idCell }} data-testid={`modelling-insured-id`}>
                {modellingTask.id}
              </TableCell>
              <TableCell data-testid={`modelling-insured-cell`}>{modellingTask.insured && modellingTask.insured.name}</TableCell>
              <TableCell nowrap data-testid={`modelling-dueDate-cell`}>
                {utils.string.t('format.date', { value: { date: modellingTask.dueDate, format: config.ui.format.date.text } })}
              </TableCell>
              <TableCell data-testid={`modelling-notes-cell`}>{modellingTask.notes}</TableCell>
              <TableCell data-testid={`modelling-status-cell`}>
                <Status
                  size="sm"
                  text={<Translate label={`status.${utils.string.replaceLowerCase(modellingTask.status)}`} />}
                  status={utils.string.replaceLowerCase(modellingTask.status)}
                />
              </TableCell>
              {popoverActions.length > 0 && (
                <TableCell menu data-testid={`modelling-edit-cell`}>
                  <PopoverMenu id="modelling-table-popover" data={{ modellingTask }} items={popoverActions} />
                </TableCell>
              )}
            </TableRow>
            {selectedId === modellingTask.id && (
              <DocumentTable key={`document-table-${index}`} documentTypeId={selectedId} documentType={constants.FOLDER_MODELLING} />
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
