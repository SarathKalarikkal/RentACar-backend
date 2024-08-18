import {User} from "../models/userModel.js"
import {Car} from "../models/carModel.js"
import {Reservation} from "../models/reservationModel.js"
import { Dealer } from "../models/dealerModel.js";



//get all users

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json({ success: true, message: "Users fetched successfully", data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};


// Delete a user
export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Get all dealers
export const getAllDealers = async (req, res, next) => {
    try {
        const dealers = await Dealer.find();
        res.json({ success: true, message: "Dealers fetched successfully", data: dealers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};
// Get all cars
export const getAllCars = async (req, res, next) => {
    try {
        const cars = await Car.find();
        res.json({ success: true, message: "Cars fetched successfully", data: cars });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Add a new car
export const addCar = async (req, res, next) => {
    try {
        const { name, images, description, make, model, fuelType, transmission, color, seating, mileage, reviews, dealer, bookedTimeSlots, rentPerHour } = req.body;


        if (!name || !images || !description || !make || !model || !fuelType || !transmission  || !color || !seating || !mileage || !dealer || !rentPerHour ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }


        const car = new Car({
           name, images, description, make, model, fuelType, transmission, color, seating, mileage, reviews, dealer, bookedTimeSlots, rentPerHour, available: available !== undefined ? available : true, 
        });

        await car.save();
        res.status(201).json({ success: true, message: "Car added successfully", data: car });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Update a car
export const updateCar = async (req, res, next) => {
    try {
        const { carId } = req.params;
        const { name, images, description, make, model, fuelType, transmission, color, seating, mileage, reviews, dealer, bookedTimeSlots, rentPerHour } = req.body;

        const car = await Car.findByIdAndUpdate(
            carId,
            { name, images, description, make, model, fuelType, transmission, color, seating, mileage, reviews, dealer, bookedTimeSlots, rentPerHour },
            { new: true }
        );

        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found" });
        }

        res.json({ success: true, message: "Car updated successfully", data: car });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};


// Delete a car
export const deleteCar = async (req, res, next) => {
    try {
        const { carId } = req.params;
        const car = await Car.findByIdAndDelete(carId);

        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found" });
        }

        res.json({ success: true, message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};


// Get all reservations
export const getAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find().populate('car user');
        res.json({ success: true, message: "Reservations fetched successfully", data: reservations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Delete a reservation
export const deleteReservation = async (req, res, next) => {
    try {
        const { reservationId } = req.params;
        const reservation = await Reservation.findByIdAndDelete(reservationId);

        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation not found" });
        }

        res.json({ success: true, message: "Reservation deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};