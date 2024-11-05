const mongoose = require('mongoose');
const Joi = require('joi');
const { customerSchema } = require('./customer');
const { movieSchema } = require('./movie');
const { tvShowSchema } = require('./tvShow');

const rentalSchema = mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: mongoose.Schema({
            name:{
                type: String,
                required: true,
                trim: true,
                minLength: 3,
                maxLength: 255
            },
            dailyRentalRate:{
                type: Number,
                min: 0,
                max: 255
            },
        }),
        required: true
    },
    rentalStartDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    rentalEndDate: {
        type: Date,
        default: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
        required: true
    },
    returnDate:{
        type: Date,
    },
    status:{
        type: String,
        enum: ["Active", "Completed", "Overdue"],
        default: "Active",
        required: true
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
        rentalStartDate: Joi.date(),
        rentalEndDate: Joi.date(),
        returnDate: Joi.date(),
        status: Joi.string().required().valid('Active', 'Completed', 'Overdue'),
        amountToRent: Joi.number().min(1).max(5)
    });

    return schema.validate({
        customerId: rental.customerId,
        movieId: rental.movieId,
        rentalStartDate: rental.rentalStartDate,
        rentalEndDate: rental.rentalEndDate,
        returnDate: rental.returnDate,
        status: rental.status,
        amountToRent: rental.rentedAmount
    });
}

exports.Rental = Rental;
exports.validateRental = validateRental;