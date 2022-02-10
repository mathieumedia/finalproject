const express = require('express');
const router = express.Router();
const {check,  validationResult } = require('express-validator');
const { v4: uid } = require('uuid');
const Sale = require('./Sale')
const InventoryVehicle = require('../inventoryRoutes/vehicles/InventoryVehicle');
const Customer = require('../customerRoutes/Customer')
const Employee = require('../employeeRoutes/Employee');
const Position = require('../positionRoutes/Position')


// @route       GET api/sales
// @desc        Get list of all Sales objects
// @access      private
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find()
            .select('-lastModified').select('-__v')
            .sort({ name: 1 });

        res.json(sales);

    } catch (err) {
        console.error(err.msg);
        res.status(500).send('Server Error');
    }
})


// @route       POST api/sales
// @desc        Add Sale objects
// @access      private
router.post('/performance', async (req, res) => {
    try {
        let sales = []
        const position = await Position.findOne({name: "Sales Representative"});
        let employees = await Employee.find()
        employees = employees.filter(e => e.employmentInfo.position.toString() === position._id.toString())
        const customers = await Customer.find();

        function getRandom(arr){
            return arr[Math.floor(Math.random()*arr.length)];
        }

        for(let i = 0; i < req.body.length; i++){
            const newSale = {
                purchaseDate: req.body[i].purchaseDate,
                vehicle: req.body[i].vehicle,
                purchasePrice: req.body[i].purchasePrice,
                soldBy: getRandom(employees)._id,
                paymentType: req.body[i].paymentType
            }
            sales.push(newSale)
        }

        const sold = await Sale.insertMany(sales)

        res.json(sold);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route       POST api/sales
// @desc        Add Sale objects
// @access      private
router.post('/', async (req, res) => {
    try {
        const {
            vehicle, customer, sale
        } = req.body;

        let newSale = {
            purchaseDate: new Date(),
        }

        const soldVehicle = await InventoryVehicle.findById(vehicle._id);
        soldVehicle.isSold = true;
        await soldVehicle.save();

        let soldCustomer = await Customer.findOne({
            firstName: customer.firstName,
            lastName: customer.lastName,
            dateOfBirth: customer.dateOfBirth
        })

        if(!soldCustomer){
            soldCustomer = new Customer(customer);

            soldCustomer.vehicles.push({
                vin: vehicle.vin,
                year: vehicle.year,
                make: vehicle.make,
                model: vehicle.model, 
                mileage: vehicle.mileage
            });
        } else {
            soldCustomer.vehicles.push({
                vin: vehicle.vin,
                year: vehicle.year,
                make: vehicle.make,
                model: vehicle.model, 
                mileage: vehicle.mileage
            });
        }

        await soldCustomer.save();

        newSale.vehicle = soldVehicle._id;
        newSale.customer = soldCustomer._id
        newSale.purchasePrice = sale.grandTotal
        newSale.paymentType = sale.paymentType === 'Cash' ? sale.paymentType : "Financed"    
    

        const completeSale = new Sale(newSale);
        await completeSale.save();
        
        res.json(completeSale);
    } catch (err) {
        console.error(err.msg);
        res.status(500).send('Server Error');
    }
})

module.exports = router;