import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// mui
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';

// app
import { Button, FormGrid, Tooltip, Translate } from 'components';
import styles from './CoverageComparison.styles';
import SummaryLine from 'components/RiskData/SummaryLine';
import { CoverageValues } from './CoverageValues';
import { CoverageForm } from './CoverageForm';
import { selectCoverages, deleteCoverages, putActivateCoverages } from 'stores';
import * as utils from 'utils';

const coverageOptionBoxWidth = 250;

const initialFormDataState = {
  isOpen: false,
  isEdit: false,
  editCoverage: null,
  coverageId: null,
  activatedClicked: false,
  isDeleting: false,
};

export const CoverageComparison = ({
  open,
  riskId,
  riskType,
  coverageDefinitionFields,
  handleOpenCoverageComparison,
  reFetchData,
  handleQuoteLoading,
}) => {
  const dispatch = useDispatch();
  const coverages = useSelector(selectCoverages) || [];
  const hasCoverages = coverages.length > 0;

  const [formData, setFormData] = React.useState(initialFormDataState);

  const coverageBottomBoxRef = React.useRef(null);
  const coverageTopBoxRef = React.useRef(null);

  const activeCoverage = coverages.find((coverage) => coverage.active) || coverages[0];

  const carriers = activeCoverage?.summaryQuotes.map((q) => ({ carrierName: q.carrierName })) || [];
  const carriersCount = carriers.length || 1;

  const classes = makeStyles(styles, { name: 'CoverageComparison' })({ columnCount: carriersCount + 1, coverageOptionBoxWidth });

  const handleCloseDrawer = () => {
    setFormData(initialFormDataState);
    handleOpenCoverageComparison();
  };

  const handleDeleteCoverage = async (id, riskId) => {
    setFormData((prevState) => ({ ...prevState, isDeleting: true }));
    await dispatch(deleteCoverages(id, riskId));
    setFormData((prevState) => ({ ...prevState, isDeleting: false }));
  };

  const handleActivateCoverage = async (id, riskId) => {
    setFormData((prevState) => ({ ...prevState, activatedClicked: true }));
    handleOpenCoverageComparison();
    setFormData(initialFormDataState);
    handleQuoteLoading(true);
    await dispatch(putActivateCoverages(id, riskId));
    reFetchData(riskId);
  };

  const handleAddCoverage = () => {
    setFormData((prevState) => ({ ...initialFormDataState, isOpen: true, isEdit: false }));
    coverageBottomBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditCoverage = (coverage) => {
    setFormData(() => ({
      isOpen: true,
      isEdit: true,
      coverageId: coverage.id,
      coverageName: coverage?.name,
      editCoverage: coverage?.patchData,
    }));
    coverageBottomBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHideForm = async () => {
    await coverageTopBoxRef.current?.scrollIntoView(true);
    setFormData(initialFormDataState);
  };

  return (
    <Drawer
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="right"
      open={open}
      onClose={handleCloseDrawer}
    >
      <Box display="flex" flexDirection="column">
        <Box display="flex" style={{ backgroundColor: '#334762' }} px={3} py={2} ref={coverageTopBoxRef}>
          <Box display="flex" flex="1">
            <Translate label={utils.string.t('products.coverageComparison')} variant="h2" className={classes.title} />
          </Box>
          <Box>
            <Button
              icon={CloseIcon}
              variant="text"
              onClick={handleCloseDrawer}
              nestedClasses={{ btn: classes.close }}
              data-testid="drawer-close-button"
              style={{ color: 'white' }}
            />
          </Box>
        </Box>
        {hasCoverages ? (
          <Box display="flex" flexDirection="column" mt={4} p={3} pt={0}>
            <Box display="flex" ml={`${coverageOptionBoxWidth}px`}>
              <Paper elevation={2} className={classes.coverageOptionsCarriers}>
                {carriers.map((carrier, index) => (
                  <Box key={`${carrier.carrierName}-${index}`} display="flex" flexDirection="column" className={classes.coverageCarrier}>
                    <Translate className={classes.coverageCarrierLabel} label={carrier.carrierName} variant="body2" />
                  </Box>
                ))}
              </Paper>
            </Box>
            <Paper elevation={2} className={classes.coverageOptions}>
              {utils.generic.isValidArray(coverages, true) &&
                coverages?.map((coverage, index) => {
                  const isActive = coverage?.active;
                  const isLastItem = index === coverage.length - 1;

                  return (
                    <Box
                      key={coverage.id}
                      elevation={2}
                      display="flex"
                      flex="1"
                      className={isActive ? classes.coverageOption : ''}
                      style={{
                        borderBottom: isLastItem ? 0 : '1px solid #ccc',
                      }}
                    >
                      <Box display="flex" flexDirection="column" className={classes.coverageOptionBox}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          p={2}
                          style={{
                            backgroundColor: isActive ? '#2cc6ab' : '#e1dfe0',
                          }}
                        >
                          <Box display="flex" alignItems="center">
                            {isActive ? <CheckIcon color="primary" style={{ color: 'green' }} /> : null}
                            <Translate
                              label={coverage.name}
                              variant="h4"
                              className={classes.coverageName}
                              style={{
                                margin: 0,
                                marginLeft: 5,
                              }}
                            />
                          </Box>
                          {isActive ? null : (
                            <Box>
                              <Button
                                icon={EditIcon}
                                size="small"
                                variant="text"
                                onClick={() => handleEditCoverage(coverage)}
                                nestedClasses={{ btn: classes.close }}
                                data-testid={`edit-coverage-button-${coverage.id}`}
                                disabled={formData.activatedClicked || formData.isDeleting}
                              />
                            </Box>
                          )}
                        </Box>

                        <CoverageValues coverageValues={coverage?.patchData} coverageDefinitionFields={coverageDefinitionFields} />

                        {!isActive ? (
                          <Box p={2} display="flex" justifyContent="flex-end" style={{ borderTop: '1px solid #ccc' }}>
                            <Button
                              icon={CheckIcon}
                              text={utils.string.t('app.apply')}
                              size="xsmall"
                              variant="contained"
                              onClick={() => handleActivateCoverage(coverage.id, coverage.riskId)}
                              nestedClasses={{ btn: classes.close }}
                              data-testid={`activate-coverage-button-${coverage.id}`}
                              disabled={formData.activatedClicked || formData.isDeleting}
                            />

                            <Button
                              icon={DeleteForeverIcon}
                              text="Delete"
                              danger
                              size="xsmall"
                              variant="contained"
                              onClick={() => handleDeleteCoverage(coverage.id, coverage.riskId)}
                              nestedClasses={{ btn: classes.close }}
                              style={{ height: 'auto', marginLeft: 8 }}
                              data-testid={`delete-coverage-button-${coverage.id}`}
                              aria-label="delete"
                              disabled={formData.activatedClicked || formData.isDeleting}
                            />
                          </Box>
                        ) : null}
                      </Box>
                      {coverage?.summaryQuotes.map((quote, index) => (
                        <Box
                          key={`${quote.carrierName}-${index}`}
                          display="flex"
                          flexGrow={1}
                          flexDirection="column"
                          className={classes.summaryQuote}
                        >
                          <Box mt={1} p={1}>
                            <FormGrid container spacing={1} justifyContent="center">
                              {quote?.premium && !quote?.hasReferrals ? (
                                <FormGrid item xs={12}>
                                  <Typography variant="h4" align="center" style={{ marginBottom: 0 }}>
                                    {utils.string.t('risks.grossPremium')}
                                  </Typography>
                                </FormGrid>
                              ) : null}
                              <FormGrid item xs={12} align="center">
                                <Typography variant="h3" align="center" className={classes.premium}>
                                  {quote?.hasReferrals || quote?.quoted === false ? (
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                      <Tooltip title={utils.string.t('products.coverage.referral')}>
                                        <InfoIcon classes={{ root: classes.infoIcon }} />
                                      </Tooltip>
                                      {utils.string.t('risks.referral')}
                                    </Box>
                                  ) : (
                                    <>
                                      {quote?.currency ? quote.currency : null}
                                      {quote?.premium ? utils.number.formatNumber(quote.premium) : null}
                                    </>
                                  )}
                                </Typography>
                              </FormGrid>
                            </FormGrid>
                            {quote?.summaryValues?.length > 0 ? (
                              <>
                                <Box pb={2} className={classes.quoteValuesBox}>
                                  <FormGrid container spacing={1} justifyContent="center">
                                    {quote?.summaryValues.map((summary) => (
                                      <SummaryLine key={summary.title} summary={summary} classes={classes} />
                                    ))}
                                  </FormGrid>
                                </Box>
                              </>
                            ) : null}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  );
                })}
            </Paper>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" mt={4} p={3} pt={0}>
            {utils.string.t('products.coverage.noCoverageOptions')}
          </Box>
        )}
        <Box px={3} mb={3}>
          <Button
            icon={AddIcon}
            variant="contained"
            color="primary"
            text={utils.string.t('products.addCoverage')}
            size="large"
            onClick={handleAddCoverage}
            style={{ width: coverageOptionBoxWidth }}
            data-testid="add-coverage-button"
            disabled={formData.activatedClicked || formData.isDeleting}
          />
        </Box>
        {/* FORM ADD NEW OPTION */}{' '}
        <Box m={3} style={{ minHeight: 600 }} data-testid="coverage-form-box">
          <Slide direction="up" in={formData.isOpen} mountOnEnter unmountOnExit>
            <Paper elevation={4} className={classes.coverageFormPaper}>
              <Box className={classes.coverageFormTitle} display="flex" alignItems="center" justifyContent="space-between">
                <Translate
                  label={
                    formData?.isEdit
                      ? `${utils.string.t('products.coverage.editCoverageOption')} ${formData?.coverageName}`
                      : utils.string.t('products.coverage.addCoverageOption')
                  }
                  variant="h4"
                  style={{
                    fontWeight: 600,
                    margin: 0,
                  }}
                />
                <Button key="close" icon={CloseIcon} variant="text" aria-label="Close" size="small" onClick={handleHideForm} />
              </Box>
              <Box m={2}>
                <CoverageForm
                  key={formData?.coverageId}
                  formData={formData}
                  riskId={riskId}
                  riskType={riskType}
                  coverageDefinitionFields={coverageDefinitionFields}
                  handleHideForm={handleHideForm}
                />
              </Box>
            </Paper>
          </Slide>
        </Box>
        <Box ref={coverageBottomBoxRef} />
      </Box>
    </Drawer>
  );
};
