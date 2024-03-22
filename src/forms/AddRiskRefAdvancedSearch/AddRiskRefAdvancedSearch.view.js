import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import { FormContainer, FormFields, FormGrid, FormText, TableHead, Overflow, FormActions, Button, TableCell, Warning } from 'components';
import * as utils from 'utils';
import styles from './AddRiskRefAdvancedSearch.styles';

// mui
import { Typography, Table, TableBody, makeStyles, TableRow, Checkbox, Box, Divider } from '@material-ui/core';

AddRiskRefAdvancedSearchView.propTypes = {
  fields: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  searchedResults: PropTypes.array.isRequired,
  addedRiskReferences: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    checkboxClick: PropTypes.func.isRequired,
  }).isRequired,
};

export default function AddRiskRefAdvancedSearchView({ fields, columns, actions, searchedResults, addedRiskReferences, handlers }) {
  const classes = makeStyles(styles, { name: 'AddRiskRefAdvancedSearch' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const { control, handleSubmit } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const addRiskReference = actions && actions.find((action) => action.name === 'addRiskReference');
  const onSubmit = (data) => {
    return addRiskReference && utils.generic.isFunction(addRiskReference.handler) && addRiskReference.handler(data);
  };
  let uniqueResults = [];
  let riskRefIds = [];
  searchedResults.forEach((res) => {
    if (!riskRefIds.includes(res.riskRefId)) {
      riskRefIds.push(res.riskRefId);
      uniqueResults.push(res);
    }
  });
  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-addRiskRefAdvancedSearch">
        <FormFields type="dialog">
          <Box my={2}>
            <Typography className={classes.subTitle}>
              {utils.string.t('processingInstructions.addRiskReference.advancedSearch.youSearchedFor')}
            </Typography>
            <Divider />
          </Box>
          <FormGrid container>
            <FormGrid item xs={12} sm={4}>
              <FormText {...utils.form.getFieldProps(fields, 'insuredCoverHolderName')} control={control} />
            </FormGrid>
            <FormGrid item xs={12} sm={4}>
              <FormText {...utils.form.getFieldProps(fields, 'department')} control={control} />
            </FormGrid>
            <FormGrid item xs={12} sm={4}>
              <FormText {...utils.form.getFieldProps(fields, 'yearOfAccount')} control={control} />
            </FormGrid>
          </FormGrid>

          {uniqueResults?.length > 0 ? (
            <Box my={4}>
              <Typography className={classes.subTitle}>
                {utils.string.t('processingInstructions.addRiskReference.advancedSearch.advancedSearchTableTitle')}
              </Typography>
              <Divider />
              <Overflow>
                <Table>
                  <TableHead
                    columns={columns}
                    nestedClasses={{ tableHead: classes.tableHead }}
                    data-testid="processing-instructions-step-1-advance-search-results-table-head"
                  />
                  <TableBody>
                    {uniqueResults?.map((searchResult) => {
                      const checked =
                        utils.generic.isValidArray(addedRiskReferences, true) &&
                        Boolean(addedRiskReferences.find((item) => item.riskRefId === searchResult.riskRefId));
                      return (
                        <TableRow key={searchResult.riskRefId}>
                          <TableCell compact minimal>
                            {
                              <Checkbox
                                color="primary"
                                checked={checked}
                                onClick={() => handlers.checkboxClick(searchResult, searchResult.riskRefId)}
                              />
                            }
                          </TableCell>
                          <TableCell>{searchResult.riskRefId}</TableCell>
                          <TableCell>{searchResult.xbInstance}</TableCell>
                          <TableCell>{searchResult.assuredName}</TableCell>
                          <TableCell>{searchResult.yoa}</TableCell>
                          <TableCell>{searchResult.clientName}</TableCell>
                          <TableCell nestedClasses={{ root: classes.instructionIdsCell }}>{searchResult.instructionIds}</TableCell>
                          <TableCell>{searchResult.status}</TableCell>
                          <TableCell>{searchResult.riskDetails}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Overflow>
            </Box>
          ) : (
            <Box p={5}>
              <Warning
                text={utils.string.t('processingInstructions.addRiskReference.advancedSearch.advancedSearchResults')}
                type="info"
                align="center"
                size="large"
                icon
              />
            </Box>
          )}
        </FormFields>
        <FormActions type="dialog">
          {addRiskReference && (
            <Button disabled={!addedRiskReferences?.length > 0} text={addRiskReference.label} type="submit" color="primary" />
          )}
        </FormActions>
      </FormContainer>
    </div>
  );
}
