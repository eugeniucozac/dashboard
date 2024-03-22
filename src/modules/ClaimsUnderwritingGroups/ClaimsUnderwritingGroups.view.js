import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import styles from './ClaimsUnderwritingGroups.styles';
import { selectClaimsInformation } from 'stores';
import {
  FormAutocompleteMui,
  FormCheckbox,
  FormContainer,
  FormLabel,
  Overflow,
  TableHead,
  TableCell,
  Pagination,
  Skeleton,
} from 'components';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';

// mui
import { makeStyles, Table, TableBody, TableRow, Box, Grid } from '@material-ui/core';

ClaimsUnderwritingGroupsView.prototypes = {
  isSectionEnabled: PropTypes.bool.isRequired,
  claimFields: PropTypes.array.isRequired,
  claimForm: PropTypes.object,
  uwResetKey: PropTypes.number,
  tableGridData: PropTypes.array,
  underWritingGroups: PropTypes.object.isRequired,
  sortingUnderwritingGroups: PropTypes.func.isRequired,
  facilityKeys: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  isUwGroupsLoading: PropTypes.bool.isRequired,
};

export function ClaimsUnderwritingGroupsView({
  isSectionEnabled,
  claimFields,
  claimForm,
  uwResetKey,
  tableGridData,
  underWritingGroups,
  sortingUnderwritingGroups,
  facilityKeys,
  cols,
  sort,
  pagination,
  isUwGroupsLoading,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsUnderwritingGroups' })();

  const dispatch = useDispatch();

  const existingClaimUWGInfo = useSelector(selectClaimsInformation).policyUnderWritingGroupDtoList;

  const sectionSelected = claimForm?.watch('ugSections');

  const { control, register, watch, setValue } = useForm();

  const selectedGroups = existingClaimUWGInfo?.map((item) => item?.groupRef) || [];

  const [groups, setGroups] = useState(!utils.generic.isInvalidOrEmptyArray(selectedGroups) ? selectedGroups : []);
  const [renderKey, setRenderKey] = useState(null);

  const isUnderWritingEmpty = utils.generic.isInvalidOrEmptyArray(underWritingGroups?.items);
  const fields = utils.generic.isValidArray(underWritingGroups?.items, true)
    ? underWritingGroups?.items.map((field) => ({
        name: field.groupRef,
        type: 'checkbox',
        defaultValue: utils.generic.isValidArray(existingClaimUWGInfo, true)
          ? existingClaimUWGInfo.filter((item) => field.groupRef === item.groupRef).length > 0
          : sectionSelected === constants.CLAIM_POLICY_SECTION_DEFAULT
          ? true
          : field.selected,
      }))
    : [];

  const checkedGroup = (ug) => {
    ug.checked ? setGroups([...groups, ug.id]) : setGroups(groups.filter((item) => item !== ug.id));
  };

  useEffect(() => {
    if (utils.generic.isInvalidOrEmptyArray(groups)) {
      setRenderKey(new Date().getTime());
      setValue('ugSections', null);
    }
    dispatch(sortingUnderwritingGroups(groups));
  }, [groups, isUnderWritingEmpty]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sectionSelected) {
      if (sectionSelected?.id?.toString() === constants.CLAIM_POLICY_SECTION_DEFAULT) {
        let allFields = fields?.map((field) => field?.name);

        let allSelectedFields =
          underWritingGroups?.items?.filter((eachUg) => eachUg.selected === true).map((eachUgData) => eachUgData?.groupRef) || [];
        let allUnSelectedFields =
          (!utils.generic.isInvalidOrEmptyArray(allSelectedFields) && allFields.filter((ref) => !allSelectedFields.includes(ref))) || [];

        let selectedAllFields = [...(!utils.generic.isInvalidOrEmptyArray(allSelectedFields) ? allSelectedFields : allFields)];

        setGroups(selectedAllFields);
        selectedAllFields?.forEach((grp) => setValue(grp, true));
        allUnSelectedFields?.forEach((grp) => setValue(grp, false));

        dispatch(sortingUnderwritingGroups(allFields));
      } else if (sectionSelected?.id) {
        const findMatchingUgs = underWritingGroups?.items
          .filter((eachUg) => eachUg?.policySectionID === Number(sectionSelected?.id))
          .map((eachUgData) => eachUgData?.groupRef);

        const existingMatchingSelected =
          underWritingGroups?.items
            .filter((eachUg) => eachUg.selected && eachUg?.policySectionID === Number(sectionSelected?.id))
            .map((eachUgData) => eachUgData?.groupRef) || [];

        const existingMatchingUnSelected =
          (!utils.generic.isInvalidOrEmptyArray(existingMatchingSelected) &&
            findMatchingUgs.filter((ref) => !existingMatchingSelected.includes(ref))) ||
          [];

        let unMatchingUgs = underWritingGroups?.items
          .filter(
            (eachUg) => existingMatchingUnSelected.includes(eachUg.groupRef) || eachUg?.policySectionID !== Number(sectionSelected?.id)
          )
          .map((eachUgData) => eachUgData?.groupRef);

        let selectedGrp = [
          ...(!utils.generic.isInvalidOrEmptyArray(existingMatchingSelected) ? existingMatchingSelected : findMatchingUgs),
        ];
        setGroups(selectedGrp);
        selectedGrp?.forEach((grp) => setValue(grp, true));
        unMatchingUgs?.forEach((grp) => setValue(grp, false));
        dispatch(sortingUnderwritingGroups(selectedGrp));
      }
    }
  }, [sectionSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetUG = () => {
    dispatch(sortingUnderwritingGroups([]));
    setGroups([]);
    fields.forEach((field) => {
      setValue(field.name, false);
    });
  };

  return (
    <Box data-testid="claims-search-table">
      <FormContainer nestedClasses={{ root: classes.form }}>
        <Overflow>
          <Grid container>
            {isSectionEnabled && (
              <>
                <Grid item xs={2} className={classes.ugSelectLabel}>
                  <FormLabel label={`${utils.string.t('claims.underWritingGroups.section')} *`} />
                </Grid>
                <Grid item xs={5} className={classes.ugSelectField} key={renderKey || uwResetKey}>
                  <FormAutocompleteMui
                    {...utils.form.getFieldProps(claimFields, 'ugSections', claimForm?.control)}
                    error={claimForm?.errors?.ugSections}
                    callback={(e, data) => !data && resetUG()}
                    onSelect={() => {
                      dispatch(sortingUnderwritingGroups([]));
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Table data-testid="claims-under-writing-groups-table" key={uwResetKey}>
            <TableHead columns={cols} sorting={sort} />
            <TableBody data-testid="claims-list">
              {isUwGroupsLoading ? (
                <TableRow>
                  <TableCell colSpan={cols?.length}>
                    <Skeleton height={50} animation="wave" displayNumber={5} />
                  </TableCell>
                </TableRow>
              ) : (
                utils.generic.isValidArray(tableGridData, true) &&
                tableGridData.map((row, i) => (
                  <TableRow key={facilityKeys[i]} data-testid={`claims-under-writing-groups-row-${row.facilityRef}`}>
                    <TableCell compact data-testid={`row-col-${row.facilityRef}`}>
                      <FormCheckbox
                        {...utils.form.getFieldProps(fields, row.groupRef)}
                        control={control}
                        register={register}
                        watch={watch}
                        muiComponentProps={{
                          onChange: (id, checked) => checkedGroup({ id, checked }),
                        }}
                      />
                    </TableCell>
                    <TableCell compact data-testid={`claims-under-writing-groups-col-${row.groupRef}`}>
                      {row.groupRef}
                    </TableCell>
                    <TableCell compact data-testid={`claims-under-writing-groups-col-${row.percentage}`}>
                      {row.percentage}
                    </TableCell>
                    <TableCell compact data-testid={`claims-under-writing-groups-col-${row.facility}`}>
                      {row.facility ? utils.string.t('form.options.yesNoNa.yes') : utils.string.t('form.options.yesNoNa.no')}
                    </TableCell>
                    <TableCell compact data-testid={`claims-under-writing-groups-col-${row.facilityRef}`}>
                      {row.facilityRef}
                    </TableCell>
                    <TableCell compact data-testid={`claims-under-writing-groups-col-${row.slipLeader}`}>
                      {row.slipLeader}
                    </TableCell>
                    <TableCell compact data-testid={`claims-under-writing-groups-col-${row.ucr}`}>
                      {''}
                    </TableCell>
                    <TableCell compact data-testid={`claims-under-writing-groups-col-${row.narrative}`}>
                      {row.narrative}
                    </TableCell>
                    <TableCell compact data-testid={`claims-under-writing-groups-col-${row.dateValidFrom}`}>
                      {utils.string.t('format.date', {
                        value: { date: row.dateValidFrom, format: config.ui.format.date.text },
                      })}
                    </TableCell>
                    <TableCell compact data-testid={`claims-under-writing-groups-col-${row.dateValidTo}`}>
                      {utils.string.t('format.date', {
                        value: { date: row.dateValidTo, format: config.ui.format.date.text },
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {utils.generic.isValidArray(tableGridData, true) && (
            <Pagination
              page={get(pagination, 'obj.page')}
              count={get(pagination, 'obj.rowsTotal')}
              rowsPerPage={get(pagination, 'obj.rowsPerPage')}
              onChangePage={get(pagination, 'handlers.handleChangePage')}
              onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
            />
          )}
        </Overflow>
      </FormContainer>
    </Box>
  );
}
