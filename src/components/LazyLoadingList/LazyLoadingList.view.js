import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './LazyLoadingList.styles';
import * as utils from 'utils';
import { Button, FormContainer, FormText, Warning } from 'components';

// mui
import { Box, Checkbox, Collapse, Fade, InputAdornment, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import LinearProgress from '@material-ui/core/LinearProgress';

LazyLoadingListView.propTypes = {
    field: PropTypes.object.isRequired,
    query: PropTypes.string,
    isSearch: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    height: PropTypes.number,
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    max: PropTypes.number,
    labels: PropTypes.shape({
        maxReached: PropTypes.string,
    }),
    isDataLoading: PropTypes.bool,
    isDataLoadingError: PropTypes.bool,
    handlers: PropTypes.shape({
        onClear: PropTypes.func.isRequired,
        onToggleOption: PropTypes.func.isRequired,
    }),

};

export function LazyLoadingListView({ id, field, query, options, selectedItems, max, labels, lastElementReference, isSearch, isDataLoading, isDataLoadingError, handlers }) {
    const classes = makeStyles(styles, { name: 'LazyLoadingList' })();

    const validationSchema = utils.form.getValidationSchema([field]);
    const { control, reset, handleSubmit } = useForm({
        ...(validationSchema && { resolver: yupResolver(validationSchema) }),
    });

    const ClearBtn = (
        <Button
            size="small"
            variant="text"
            icon={CloseIcon}
            onClick={handlers.onClear(reset)}
            nestedClasses={{ btn: classes.clearBtn }}
            data-testid={`lazy-select-clear-${id}`}
        />
    );
    const valuesIds = utils.generic.isValidArray(selectedItems, true) && selectedItems.map((v) => v.id) || [];
    const isMaxReached = Boolean(max && selectedItems?.length >= max);

    return (
        <Box className={classes.root} width={'100%'}>
            {!utils.generic.isValidArray(options) &&
                <Box className={classes.linearProgressSection}>
                    <Box className={classes.loadingListItem} >
                        {utils.string.t('app.noDataDisplay')}
                    </Box>
                </Box>
            }
            {isSearch && (
                <FormContainer
                    onSubmit={handleSubmit(handlers.onSearch)}
                    nestedClasses={{ root: classes.form }}
                >
                    <FormText
                        {...field}
                        control={control}
                        muiComponentProps={{
                            ...field.muiComponentProps,
                            classes: {
                                root: classes.input,
                            },
                            InputProps: {
                                startAdornment: (
                                    <InputAdornment position="start" classes={{ root: classes.adornmentStart }}>
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end" classes={{ root: classes.adornmentEnd }}>
                                        {query ? ClearBtn : <span />}
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </FormContainer>
            )}
            {Boolean(max) && (
                <Collapse in={isMaxReached}>
                    <Fade in={isMaxReached}>
                        <Box mt={1} mb={1}>
                            <Warning type="info" icon text={labels.maxReached || utils.string.t('filters.multiSelect.maxReached', { max })} />
                        </Box>
                    </Fade>
                </Collapse>
            )}

            <List dense className={classes.list}>
                {utils.generic.isValidArray(options, true) && options?.map((option, index) => {
                    const labelId = `multi-select-checkbox-list-label-${option.id}`;
                    const isSelected = valuesIds.includes(option.id);

                    if (options.length === index + 1) {
                        return (
                            <ListItem
                                key={option.id}
                                button
                                onClick={() => {
                                    handlers.onToggleOption(option);
                                }}
                                disabled={isMaxReached && !isSelected}
                                classes={{ root: classes.listItem }}
                                ref={lastElementReference}
                            >

                                <ListItemIcon classes={{ root: classes.listItemIcon }}>
                                    <Checkbox
                                        checked={isSelected}
                                        color="primary"
                                        tabIndex={-1}
                                        disableRipple
                                        disabled={isMaxReached && !isSelected}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={option.name} />
                            </ListItem>

                        );
                    } else {
                        return (<ListItem
                            key={option.id}
                            button
                            onClick={() => {
                                handlers.onToggleOption(option);
                            }}
                            disabled={isMaxReached && !isSelected}
                            classes={{ root: classes.listItem }}
                        >
                            <ListItemIcon classes={{ root: classes.listItemIcon }}>
                                <Checkbox
                                    checked={isSelected}
                                    color="primary"
                                    tabIndex={-1}
                                    disableRipple
                                    disabled={isMaxReached && !isSelected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={option.name} />
                        </ListItem>)
                    }
                })}
                {
                    isDataLoading &&
                    <Box className={classes.linearProgressSection}>
                        <Box className={classes.loadingListItem} >
                            {utils.string.t('app.loading')}
                        </Box>
                        <LinearProgress color="secondary" className={classes.linearProgress} />
                    </Box>
                }
                {isDataLoadingError &&
                    <ListItem classes={{ root: classes.listItem }} button>
                        <ListItemText button id={'error'} primary={'Error'} />
                    </ListItem>
                }
            </List>
        </Box>
    );
}
