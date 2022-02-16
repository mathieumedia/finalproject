import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import {
    Paper, TextField, MenuItem, Stack
} from '@mui/material'
import {
    styled
} from '@mui/styles'
import {RoundToTwo} from '../../utils/Formatter';

//#region CONTEXT
import { useInventoryVehicles, useSales, useCustomer, useDefault } from '../../hooks/customHooks';
//#endregion

//#region COMPONENTS
import VehiclePurchaseStepper from './VehiclePurchaseStepper';
import MainContainer from '../../components/MainContainer';
import PersonalInfo from '../../components/peopleComponents/PersonalInfo';
import Address from '../../components/Address'
import FeesAndCredits from './FeesAndCredits';
import Financing from './Financing';
import VehicleInfo from './VehicleInfo';
import Loading from '../../components/Loading';
import Alerts from '../../components/Alerts';

//#endregion

const Image = styled('img')(() => ({
    width: '50%',
    objectFit: 'contain',
    borderRadius: 30
}))

const VehiclePurchase = () => {
    const {id} = useParams();
    const navigate = useNavigate()
    
    const {inventoryVehicles, getVehicles, getVehicleById, currentVehicle} = useInventoryVehicles();
    const {saleVehicle, addUIErrors, errors, removeError} = useSales();
    const {customerList, getCustomers} = useCustomer();
    const {defaults, getAll} = useDefault();

    const [isLoading, setLoading] = useState(true)

    const [purchase, setPurchase] = useState({
        vehicle: {},
        customer: {address: {}}
    })
    useEffect(() => {
        if(inventoryVehicles === null){
            getVehicles()
        }

        if(!customerList){
            getCustomers()
        } else {
            setPurchase({
                ...purchase, 
                customer: customerList[0]
            })
        }

        if(!defaults) {
            getAll()
        }

        if(customerList && inventoryVehicles && defaults){
            setLoading(false)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
            inventoryVehicles, id, 
            customerList, getCustomers, defaults,
            errors,
        ]
    )

    useEffect(() => {
        if(currentVehicle === null || currentVehicle._id !== id){
            getVehicleById(id)
        }

        if(currentVehicle && currentVehicle._id === id){

            const dealerPercentage = 0.1
            const stateTax = 0.07;

            const vehicle = currentVehicle
            const dealerFees = RoundToTwo(vehicle.price * dealerPercentage)

            const subtotal = RoundToTwo(vehicle.price + dealerFees);
            const taxes = RoundToTwo(subtotal * stateTax)
            const balance = RoundToTwo(subtotal + taxes)
            const grandTotal = balance
            setPurchase({
                ...purchase, 
                vehicle: currentVehicle,
                sale: {
                    financing: {},
                    vehiclePrice: vehicle.price,
                    dealerFees: dealerFees,
                    subtotal: subtotal,
                    taxes: taxes,
                    balance: balance,
                    grandTotal: grandTotal
                },
                constants: {
                    dealerPercentage: dealerPercentage,
                    stateTax: stateTax
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentVehicle, id, getVehicleById])

    const [activeStep, setActiveStep] = useState(0);

    const steps = ['Vehicle Info', 'Customer Info', 'Customer Address', 'Fees And Credits', "Financing", "Review"];
    const handleNext = () => {
        if(activeStep < steps.length - 1){

            const errors = validateStep(activeStep, purchase.customer)
            if(errors.length > 0){
                addUIErrors(errors)
                return
            } 

            if(steps[activeStep] === 'Fees And Credits' && purchase.sale.balance === 0){
                saleVehicle(purchase)
                setActiveStep((prevActiveStep) => prevActiveStep + 2)
                return;
            }

            if(steps[activeStep] === 'Financing') {
                saleVehicle(purchase)
            }
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handlePrev = () => {
        if(steps[activeStep] === 'Review') {
            setActiveStep((prevActiveStep) => prevActiveStep - 2);
            return
        }
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSuccess = async () => {
        //prettyAlert(purchase)
        navigate("/sales/showroom")
    }

    const handlePurchaseChange = e => {
        let {name, value} = e.target;
        const personal = ['firstName', 'middleName', 'lastName', 'ssn', 'dateOfBirth', 'gender', 'phone', 'email']

        const address = ['street', 'aptNum', 'city', 'state', 'country', 'zipcode']

        const feesAndCredits = ['downPayment']

        const financing = ['bank', "term"]
        
        if(personal.includes(name)){
            setPurchase(prev => {
                return {
                    ...prev,
                    customer:{
                        ...prev.customer,
                        [name]: value
                    }
                }
            })
            return 
        }

        if(address.includes(name)){
            setPurchase(prev => {
                return {
                    ...prev,
                    customer: {
                        ...prev.customer,
                        address: {
                            ...prev.customer.address,
                            [name]: value
                        }
                    }
                }
            })
        }

        if(feesAndCredits.includes(name)){
            const balance = RoundToTwo(purchase.sale.grandTotal - +value)

            if(+value <= purchase.sale.grandTotal){
                
                setPurchase(prev => {
                    return {
                        ...prev,
                        sale: {
                            ...prev.sale,
                            balance: balance,
                            [name]: value,
                            paymentType: balance > 0 ? 'Financed' :'Cash'
                        }
                    }
                })
            } 
            else {
                alert("Down payment cannot be more than grand total")
            }
        }

        if(financing.includes(name)){
            let bank = purchase.sale.financing.bank;
            if(name === 'bank') {
                bank = value;
                setPurchase(prev => {
                    return {
                        ...prev,
                        sale: {
                            ...prev.sale,
                            financing:{
                                ...prev.sale.financing,
                                bank: bank
                            }
                        }
                    }
                })
            }

            let tempTerm = purchase.sale.financing.term
            if(name === 'term'){
                tempTerm = purchase.sale.financing.bank.terms.find(t => t._id === value);
                const balance = purchase.sale.balance
                const totalInterest = RoundToTwo(balance * tempTerm.apr);
                const loanValue = RoundToTwo(balance + totalInterest);
                const monthlyPayment = loanValue / tempTerm.termLength
                setPurchase(prev => {
                    return {
                        ...prev,
                        sale: {
                            ...prev.sale,
                            financing:{
                                ...prev.sale.financing,
                                term: tempTerm._id,
                                totalInterest: totalInterest,
                                loanValue: loanValue,
                                monthlyPayment: monthlyPayment
                            }
                        }
                    }
                })
            }
        }
    }

    function DisplaySteps(){

        switch(activeStep){
            case 0:
                return isLoading 
                ? <Loading  /> 
                : <VehicleInfo defaults={defaults} vehicle={purchase.vehicle}  />
            case 1:
                return (
                    isLoading 
                    ?   <Loading  /> 
                    :   <div >
                            <TextField 
                                sx={{pb: 2}}
                                fullWidth label='Customer List' value={''}
                                select onChange={e => setPurchase({...purchase, customer: customerList.find(c => c._id === e.target.value)})}
                            >
                                <MenuItem disabled>Select Customer</MenuItem>

                                {customerList && customerList.map(customer => (
                                    <MenuItem key={customer._id} value={customer._id}>{customer.firstName} {customer.lastName}</MenuItem>
                                ))}
                            </TextField>

                            <PersonalInfo 
                                sx={{mx: 0}}
                                data={purchase.customer} isDisabled={false} handleChange={handlePurchaseChange} defaults={defaults} />
                        </div>
                )
            case 2:
                return isLoading 
                ?  <Loading  /> 
                :  <Address address={purchase.customer.address} defaults={defaults} 
                    handleChange={handlePurchaseChange}/>
            case 3:
                return isLoading 
                ?  <Loading  /> 
                :  <FeesAndCredits purchase={purchase} defaults={defaults} 
                    handleChange={handlePurchaseChange}/>
            case 4:
                return isLoading 
                ?  <Loading  /> 
                :  <Financing 
                    purchase={purchase} 
                    defaults={defaults} 
                    handleChange={handlePurchaseChange}
                    />
            case 5:
                return <Image src='/images/congrats.jpg' alt='congratulates' sx={{width: '100px'}}/>
            default:
                return null
        }
    }

    return (
        <MainContainer>
            <VehiclePurchaseStepper 
                steps={steps}
                handleNext={handleNext} 
                handlePrev={handlePrev} 
                handleFinal={handleSuccess}
                activeStep={activeStep}>
                <Stack spacing={1}>
                    {errors &&     
                        <Paper>
                            <Alerts alerts={errors} removeAlert={removeError} />
                        </Paper>
                    }

                    <Paper>
                        {DisplaySteps()}
                    </Paper>
                </Stack>

            </VehiclePurchaseStepper>
        </MainContainer>
    )
}

function validateStep(activeStep, data){
    let errors = []
    switch(activeStep){
            case 1:
                if(!data.firstName || data.firstName.length === 0) errors.push({severity: 'error', msg: "First Name is required"})
                if(!data.lastName || data.lastName.length === 0) errors.push({severity: 'error', msg: "Last Name is required"})
                if(!data.dateOfBirth || data.dateOfBirth.length === 0) errors.push({severity: 'error', msg: "Date of Birth is required"})
                if(!data.ssn || data.ssn.length === 0) errors.push({severity: 'error', msg: "SSN is required"})
                if(!data.phone || data.phone.length === 0) errors.push({severity: 'error', msg: "Phone # is required"})
                if(!data.email || data.email.length === 0) errors.push({severity: 'error', msg: "SEmailSN is required"})
                return errors 
            case 2:
                return errors 
            case 3:
                return errors
            case 4:
                return errors
            case 5:
                return errors
            default:
                return errors
        }

}

export default VehiclePurchase
