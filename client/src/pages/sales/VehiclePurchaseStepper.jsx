import * as React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

import {
    Grid, Button, Paper
} from '@mui/material'

import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
            'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
            'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
}));



function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <ElectricCarIcon />,
        2: <AccountCircleIcon />,
        3: <HomeIcon />,
        4: <AccountBalanceWalletIcon />,
        5: <AccountBalanceIcon />,
        6: <CheckCircleIcon />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
};

export default function CustomizedSteppers(props) {
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Paper padding={1}>
                    <Stepper alternativeLabel activeStep={props.activeStep} connector={<ColorlibConnector />}>
                        {props.steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                {props.children}
            </Grid>

            <Grid item xs={12} >
                <Paper>
                    <Grid container spacing={2} 
                        justifyContent={'center'} 
                        alignItems={'center'}>
                        
                        {props.activeStep >= props.steps.length - 1
                            ? <Grid item >
                                    <Button 
                                        onClick={props.handleFinal}>
                                        Continue
                                    </Button>
                                </Grid>
                            : <>
                                <Grid item >
                                    <Button 
                                        disabled={props.activeStep < 1 }
                                        variant='outlined' 
                                        onClick={props.handlePrev}>
                                        Prev
                                    </Button>
                                </Grid>

                                <Grid item >
                                    <Button 
                                        disabled={props.activeStep === props.steps.length - 1}
                                        onClick={props.handleNext}>
                                        Next
                                    </Button>
                                </Grid>
                            </>
                            
                        }
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
        
    );
}
