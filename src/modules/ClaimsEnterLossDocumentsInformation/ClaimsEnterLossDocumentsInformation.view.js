import React from 'react';

//app
import styles from './ClaimsEnterLossDocumentsInformation.styles';

//mui
import { makeStyles, Card, CardHeader, CardContent, Typography, Grid, Box } from '@material-ui/core';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import MailIcon from '@material-ui/icons/Mail';

export function ClaimsEnterLossDocumentsInformationView() {
  const classes = makeStyles(styles, { name: 'ClaimsEnterLossDocumentsInformation' })();

  return (
    <>
      <Card variant="outlined">
        <CardHeader className={classes.cardHeader} title={<Typography variant="subtitle1">Loss Documents</Typography>} />
        <CardContent className={classes.cardContent}>
          <Typography variant="subtitle2" style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Documents
          </Typography>
          <Box py={2}>
            <Grid container>
              <Grid item sm={4} xs={12}>
                <Typography variant="body1" align="center" className={classes.cardText}>
                  Firm Order Slip
                </Typography>
                <p className={classes.attachDoc}>
                  <PictureAsPdfIcon color="primary" />
                  <span>FileName1.pdf</span>
                </p>
              </Grid>
              <Grid item sm={4} xs={12}>
                <Typography variant="body1" align="center" className={classes.cardText}>
                  Processing Insturtions
                </Typography>
                <p className={classes.attachDoc}>
                  <PictureAsPdfIcon color="primary" />
                  <span>FileName1.pdf</span>
                </p>
              </Grid>
              <Grid item sm={4} xs={12}>
                <Typography variant="body1" align="center" className={classes.cardText}>
                  Transaction Sheets
                </Typography>
                <p className={classes.attachDoc}>
                  <MailIcon color="primary" />
                  <span>SampleEmail.html</span>
                </p>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
