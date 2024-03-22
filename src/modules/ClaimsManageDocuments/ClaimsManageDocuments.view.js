import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import styles from './ClaimsManageDocuments.styles';
import { ClaimsManageDocumentsTable } from './ClaimsManageDocumentsTable';
import { DmsSearch, Accordion, TableHead, TableCell, Button, FilterBar } from 'components';
import { RegisterNewLossFixedBottomBar } from 'modules';
import { selectClaimsPolicyInformation } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, Grid, Box, Typography, Checkbox, FormControlLabel, Table, TableBody, TableRow } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

ClaimsManageDocumentsView.propTypes = {
  activeStep: PropTypes.number.isRequired,
  isAllStepsCompleted: PropTypes.bool.isRequired,
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  cols: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  formControls: PropTypes.object.isRequired,
  popoverActions: PropTypes.array.isRequired,
  searchFields: PropTypes.array.isRequired,
  searchActions: PropTypes.array.isRequired,
  claimDocuments: PropTypes.array.isRequired,
  lossDocuments: PropTypes.array.isRequired,
  selectAll: PropTypes.bool,
  isDmsFileViewGridDataLoading: PropTypes.bool,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    formStatus: PropTypes.func.isRequired,
    sendDocumentToGXB: PropTypes.func.isRequired,
    setSelectAll: PropTypes.func.isRequired,
    updateClaimFileListAfterLinking: PropTypes.func.isRequired,
    viewDocLauncher: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsManageDocumentsView({
  activeStep,
  isAllStepsCompleted,
  index,
  cols,
  fields,
  formControls,
  popoverActions,
  searchFields,
  searchActions,
  claimDocuments,
  lossDocuments,
  selectAll,
  isDmsFileViewGridDataLoading,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsManageDocuments' })();

  const policyInformation = useSelector(selectClaimsPolicyInformation);

  const [isLossAccordionExpanded, setLossAccordionExpanded] = useState(true);
  const [isClaimAccordionExpanded, setClaimAccordionExpanded] = useState(true);

  const { control, register, watch, setValue } = formControls;

  const dms = {
    context: constants.DMS_CONTEXT_POLICY,
    source: policyInformation?.sourceId,
    refData: { ...policyInformation },
    isFnolDmsSearch: true,
    updateClaimFileListAfterLinking: handlers.updateClaimFileListAfterLinking,
    documentTypeKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim,
  };

  const formValues = watch();
  const allFields = fields?.filter((field) => field?.type === 'checkbox')?.map((field) => field?.name);

  const updateSelectAll = (status) => {
    allFields.forEach((grp) => setValue(grp, status));
    handlers.setSelectAll(status);
    handlers.formStatus();
  };

  const saveHandle = () => {
    async function sendDocument() {
      handlers.sendDocumentToGXB(formValues);
      await handlers.save(index);
    }
    sendDocument();
  };

  const nextHandle = () => {
    async function sendDocument() {
      handlers.sendDocumentToGXB(formValues);
      await handlers.next(index);
    }
    sendDocument();
  };

  const referenceId = policyInformation?.policyRef;

  const tableProps = {
    control,
    register,
    watch,
    fields,
    allFields,
    cols,
    popoverActions,
    isDmsFileViewGridDataLoading,
    handlers: { ...handlers },
  };

  return (
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box flex="1 1 auto" className={classes.container}>
        <Box mt={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <DmsSearch {...dms} referenceId={referenceId} isAutoSearchScreen handleFormStatus={handlers.formStatus} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mt={1} ml={2}>
                <Box display="flex" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <DescriptionOutlinedIcon className={classes.icon} />

                    <Typography variant="body2" className={classes.title}>
                      {utils.string.t('claims.manageDocumentLabels.claimFile')}
                    </Typography>
                  </Box>
                  <Box width={'50%'} marginLeft="auto">
                    <FilterBar id="userFilter" fields={searchFields} actions={searchActions} />{' '}
                  </Box>
                </Box>

                <Table size="small">
                  <TableHead columns={cols} />
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Accordion
                          icon={false}
                          expanded={isLossAccordionExpanded}
                          defaultHeader={false}
                          actions={[
                            {
                              id: 'manageLossDocs',
                              text: utils.string.t('claims.manageDocumentLabels.loss'),
                              icon: KeyboardArrowUpIcon,
                              iconPosition: 'left',
                              color: 'primary',
                              onClick: () => {
                                setLossAccordionExpanded(!isLossAccordionExpanded);
                              },
                            },
                          ]}
                        >
                          <ClaimsManageDocumentsTable documents={lossDocuments} {...tableProps} />
                        </Accordion>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={4}>
                        <Accordion
                          icon={false}
                          expanded={isClaimAccordionExpanded}
                          defaultHeader={false}
                          actions={[
                            {
                              id: 'manageLossDocs',
                              text: utils.string.t('claims.manageDocumentLabels.claim'),
                              icon: KeyboardArrowUpIcon,
                              iconPosition: 'left',
                              color: 'primary',
                              onClick: () => {
                                setClaimAccordionExpanded(!isClaimAccordionExpanded);
                              },
                            },
                          ]}
                        >
                          <ClaimsManageDocumentsTable documents={claimDocuments} {...tableProps} />
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {false && ( //adding false temporary to hide the Select All
                  <Box mt={10} ml={5}>
                    <Button
                      color="primary"
                      size="xsmall"
                      variant="outlined"
                      disabled={false}
                      text={<FormControlLabel control={<Checkbox checked={selectAll} />} label="SELECT ALL" />}
                      data-testid="bulk-button"
                      onClick={() => {
                        updateSelectAll(!selectAll);
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box flex="0 1 auto">
        <RegisterNewLossFixedBottomBar
          activeStep={activeStep}
          isAllStepsCompleted={isAllStepsCompleted}
          handleBack={() => {
            handlers.back(index);
          }}
          handleSave={() => {
            saveHandle();
          }}
          handleNextSubmit={() => nextHandle()}
          save={true}
        />
      </Box>
    </Box>
  );
}
