/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router';

import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';

import * as utils from 'utils';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';

import styles from './AddEditQuoteBind.style';
import { FormActions, FormFields, Translate, RiskData } from 'components';

import RenderStep from './RenderStep';
import FormSkeleton from './FormSkeleton';

import config from 'config';

function getSteps(steps) {
  return steps.map((step) => capitalize(step));
}

export default function MultiStepForm({
  fields,
  isReQuote,
  defaultValues,
  riskDataValues,
  handleSubmit,
  definitionsFields,
  hasCountryOfOrigin,
  isLoading,
  productType,
  handleDraftSave,
  fullScreen,
}) {
  const classes = makeStyles(styles, { name: 'MultiStepForm' })({ fullScreen });
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [stepFields, setStepFields] = useState([]);
  const [progress, setProgress] = useState(0);
  const [validationSchema, setValidationSchema] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setProgress(activeStep ? (activeStep / stepFields.length) * 100 : 0);
  }, [activeStep]);

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(utils.form.getValidationSchema(validationSchema)),
    mode: 'onChange',
  });

  const groups = utils.risk.getGroups(fields);
  const groupsTitles = Object.entries(groups).map((group, index) => {
    return startCase(group[0]);
  });

  const groupsIDs = Object.entries(groups).map((group, index) => {
    return group[0];
  });

  const steps = [...getSteps(groupsTitles), utils.string.t('risks.addRiskConfirmation')];

  useEffect(() => {
    const fieldGroups = { ...groups };
    const fieldGroupsArray = Object.entries(fieldGroups).map((group, index) => group);
    setStepFields(fieldGroupsArray);
  }, [fields]);

  useEffect(() => {
    const validateFields = fields.filter((field) => {
      const condition = utils.risk.getCondition(field, fields);
      const isValid = !condition || (condition && utils.risk.isConditionValid(condition, methods.watch(condition.name)));

      return isValid ? true : false;
    });

    if (validationSchema?.length !== validateFields?.length) setValidationSchema(validateFields);
  }, [methods.formState]);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps() - 1;
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
  };

  const handleNext = async () => {
    const schemaFields = stepFields[activeStep] ? stepFields[activeStep][1] : [];

    const validateFields = schemaFields
      .filter((field) => {
        const condition = utils.risk.getCondition(field, fields);
        const isValid = !condition || (condition && utils.risk.isConditionValid(condition, methods.watch(condition.name)));

        return isValid ? true : false;
      })
      .map((field) => field.name)
      .filter((field) => (field ? true : false));

    const isStepValid = await methods.trigger(validateFields);

    if (isStepValid) {
      handleComplete();

      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1;
      setActiveStep(newActiveStep);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSave = async () => {
    const data = methods.getValues();
    if (data.clientId && utils.generic.isValidObject(data.clientId)) {
      handleDraftSave(data);
    } else {
      methods.trigger('clientId', { shouldFocus: true });
    }
  };

  const onSubmit = async (data) => {
    const res = await handleSubmit(data);
    !isReQuote && history.push(`${config.routes.quoteBind.riskDetails}/${res?.id}`);
  };

  const onError = (errors, e) => console.log(errors, e);

  function getStepContent(step, fieldsArray) {
    return fieldsArray[1]?.length ? (
      <RenderStep
        fieldsArray={fieldsArray[1]}
        fields={fields}
        definitionsFields={definitionsFields}
        classes={classes}
        options={{ gridSize: { xs: 12, md: 4, xl: 4 } }}
      />
    ) : null;
  }

  return (
    <div className={classes.root}>
      {isLoading ? (
        <>
          <Box p={4}>
            <Skeleton height={58} variant="rect" />
          </Box>
        </>
      ) : (
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} onClick={handleStep(index)} completed={completed[index]}>
              <StepLabel
                StepIconProps={{
                  classes: { root: classes.iconContainer },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      <LinearProgress variant="determinate" value={progress} className={classes.linearProgress} />
      <FormProvider {...methods}>
        <Box>
          <form>
            <div type="dialog" autoComplete="off" data-testid="risk-form">
              <FormFields type="dialog" nestedClasses={{ root: isLastStep() ? classes.summary : classes.formContent }}>
                {isLoading ? (
                  <>
                    <FormSkeleton />
                  </>
                ) : (
                  <>
                    {stepFields[activeStep] ? (
                      getStepContent(activeStep, stepFields[activeStep])
                    ) : isLastStep() ? (
                      <RiskData
                        handleStep={handleStep}
                        groups={groupsIDs}
                        definitionsFields={fields}
                        riskDataValues={riskDataValues}
                        isReQuote={isReQuote}
                      />
                    ) : null}
                  </>
                )}
              </FormFields>
              <FormActions type="dialog">
                {!isReQuote ? (
                  <Button onClick={onSave} color="secondary" variant="contained">
                    {utils.string.t('app.saveDraft')}
                  </Button>
                ) : null}
                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                  {utils.string.t('app.backToPrevious')}
                </Button>
                <Button
                  variant="contained"
                  disabled={methods.formState.isSubmitting}
                  color="primary"
                  onClick={() => (isLastStep() && methods.formState.isValid ? methods.handleSubmit(onSubmit, onError)() : handleNext())}
                >
                  {isLastStep() && methods.formState.isValid ? <Translate label="app.submit" /> : `Next`}
                </Button>
              </FormActions>
            </div>
          </form>
        </Box>
      </FormProvider>
    </div>
  );
}
