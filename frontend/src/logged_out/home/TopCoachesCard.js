import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
    cardWrapper: {
        textAlign: 'center',
        padding: theme.spacing(2),
        width: "350px",
        marginBottom: theme.spacing(3),
    },
    imageWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: theme.spacing(2),
    },
    image: {
        width: '150px',
        borderRadius: "9999px",
    },
    centeredText: {
        textAlign: 'center',
    },
});

function TopCoachesCard(props) {
    const { classes, image, headline, text } = props;
    return (
        <Fragment>
            <div className={classes.cardWrapper}>
                <div className={classes.imageWrapper}>
                    {image}
                </div>
                <Typography variant="h5" paragraph className={classes.centeredText}>
                    {headline}
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph className={classes.centeredText}>
                    {text}
                </Typography>
            </div>
        </Fragment>
    );
}

TopCoachesCard.propTypes = {
    classes: PropTypes.object.isRequired,
    image: PropTypes.object.isRequired,
    headline: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default withStyles(styles, { withTheme: true })(TopCoachesCard);
