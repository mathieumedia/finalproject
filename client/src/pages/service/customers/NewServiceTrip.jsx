import React, {useState, useEffect} from 'react';
import {
    Grid, TextField, 
    MenuItem, Button, Box
} from '@mui/material'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Loading from '../../../components/Loading'

const NewServiceTrip = (props) => {
    const {
        onSave, 
        onClose
    } = props;
    const [service, setService] = useState(null)
    const [selectedTrip, setSelectedTrip] = useState({

            date: new Date(),
            serviceName: '',
            parts: [],
            labor: {}
    })

    const handleSelectedTrip = e => {
        const {value} = e.target
        setSelectedTrip(value)
        setService({
            serviceName: value.serviceName,
            labor: {
                ...value.labor, 
                cost: value.labor.laborRate * value.labor.duration
            }
        })
    }

    const [newPart, setNewPart] = useState({})

    const handleNewPart = e => {
        const {name, value} = e.target;
        if(name === 'partName'){
            setNewPart(value)
        } else if(name === 'quantity') {
            setNewPart(prev => {
                return {
                    ...prev,
                    quantity: value,
                    cost: newPart.unit * value
                }
            })
        }
    }
    
    const AddNewPart = () => {
        setService(prev => {
            return {
                ...prev,
                parts: [...prev.parts || [], newPart]
            }
        })
    }    
    return (
        <Grid container spacing={2} sx={{width: '50vw', justifyContent: 'center'}}>
            <Grid item xs={12}>
                <TextField 
                    name='serviceName' onChange={handleSelectedTrip}
                    label='Service Type' select >
                        <MenuItem value={null}> --none-- </MenuItem>
                        {SERVICES.map(service => (
                            <MenuItem key={service.serviceName} value={service}>{service.serviceName}</MenuItem>
                        ))}
                </TextField>
            </Grid>

            {selectedTrip &&
                <React.Fragment>   
                    <Grid item xs={4} >
                        <TextField 
                            name='partName' 
                            onChange={handleNewPart}
                            label='Part' select >
                                <MenuItem value={null}> --none-- </MenuItem>
                                {selectedTrip.parts.map(part => (
                                    <MenuItem key={part.partName} value={part}>{part.partName}</MenuItem>
                                ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField 
                            name='quantity' onChange={handleNewPart}
                            label='Quantity' select value={newPart.quantity || ''}>
                                <MenuItem value={null}> --none-- </MenuItem>
                                {[1,2,3,4,5].map(quantity => (
                                    <MenuItem key={quantity} value={quantity}>{quantity}</MenuItem>
                                ))}
                        </TextField>
                    </Grid>
                    <Grid item xs>
                        <Button size={'size'} onClick={AddNewPart}>Add Part</Button>
                    </Grid>
                </React.Fragment>
            } 

            <Grid item xs={12}>
                {service 
                    ? <BasicTable service={service} onClose={onClose} onSave={onSave}/> : <Loading />
                }
                {service 
                    ? null 
                    : <Button fullWidth={false} onClick={onClose} >Cancel</Button>
                }
            </Grid>
        </Grid>
    )
}

function BasicTable(props) {
    const {
        service,
        onClose,
        onSave
    } = props;
    const [trip, setTrip] = useState({parts: []})

    useEffect(() => {
        setTrip(service)
    },[service])
    const {
        serviceName, 
        parts, labor
    } = trip;

    
    return (
        <React.Fragment>
                        <Table aria-label="simple table">
                <TableHead>
                    <TableRow >
                        <TableCell colSpan={4} align='left'>Service Type:    {serviceName}</TableCell>
                    </TableRow>
                    
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align='left'>Desc</TableCell>
                        <TableCell align='left'>Quantity</TableCell>
                        <TableCell align='left'>Unit</TableCell>
                        <TableCell align='right'>Cost</TableCell>
                    </TableRow>
                    {labor && 
                        <TableRow >
                            <TableCell align='left'>Labor</TableCell>
                            <TableCell align='left'>{labor.duration}</TableCell>
                            <TableCell align='left'>{labor.laborRate}/hr</TableCell>
                            <TableCell align='right'>{labor.laborRate * labor.duration}</TableCell>
                        </TableRow>
                    }
                    {parts && parts.map(part => (
                        <TableRow key={part.partName}>
                            <TableCell align='left'>{part.partName}</TableCell>
                            <TableCell align='left'>{part.quantity}</TableCell>
                            <TableCell align='left'>{part.unit}</TableCell>
                            <TableCell align='right'>{part.quantity * part.unit}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box sx={{
                display: 'flex', pt: 1,
                justifyContent: "space-around"}}>
                <Button 
                    fullWidth={false} 
                    variant={'outlined'}
                    onClick={onClose}>
                    Cancel
                </Button>
                
                <Button 
                    onClick={() => onSave(service)}
                    fullWidth={false}>
                    Save Service
                </Button>
            </Box>  
        </React.Fragment>
    );
}

const SERVICES = [
    {
        "serviceName": "Oil Change",
        "parts": [
            {
                "partName": "Synthetic Oil",
                "unit": 19.99
            }, 
            {
                "partName": "Oil Filter",
                "unit": 34.50
            }
        ],
        "labor": {
            "laborRate": 50,
            "duration": 1.3
        }
    },
    {
        "serviceName": "Tire Change",
        "parts": [
            {
                "partName": "Micheline Tire",
                "unit": 99
            }
        ],
        "labor":{
            "laborRate": 50,
            "duration": 2.5
        }
    },
    {
        "serviceName": "Radiator Flush",
        "parts": [
            {
                "partName": "Cooland Fluid",
                "unit": 25.99
            }
        ],
        "labor":{
            "laborRate": 50,
            "duration": 1.7
        }
    }
]


export default NewServiceTrip
