import { Reservation } from "../models/reservationModel.js";
import {Car} from "../models/carModel.js"


//create reservation
export const createReservation = async (req, res, next) => {
   try {
      const { carId, startDate, endDate, rentPerHour } = req.body;
      const userId = req.user.id;

      // Ensure that the input dates are in YYYY-MM-DD format
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
         return res.status(400).json({ success: false, message: "Invalid date format" });
      }

      if (start >= end) {
         return res.status(400).json({ success: false, message: "Start date must be before end date" });
      }

      if (!startDate || !endDate || !rentPerHour) {
         return res.status(400).json({ success: false, message: "All fields are required" });
      }

      console.log("carId", carId);
      const car = await Car.findById(carId);

      if (!car) {
         return res.status(404).json({ success: false, message: "Car not found" });
      }
      
      const existReservation = await Reservation.findOne({ car: carId, startDate: { $lt: end }, endDate: { $gt: start } });
      
      if (existReservation) {
         return res.status(404).json({ success: false, message: "Car already reserved for this period" });
      }

      // Create a new reservation with status pending
      const reservation = new Reservation({
         car: carId,
         user: userId,
         startDate: start,
         endDate: end,
         rentPerHour,
      });
      await reservation.save();

      res.status(201).json({ success: true, message: "Reservation created, awaiting approval", data: reservation });

   } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
   }
}




//approveReservation 
export const approveReservation  = async(req, res, next)=>{
   try {
      
      const {id} =  req.params
      const reservation = await Reservation.findById(id)

      if (!reservation) {
         return res.status(404).json({ success: false, message: "Reservation not found" });
     }

     if (reservation.status !== 'pending') {
      return res.status(400).json({ success: false, message: "Only pending reservations can be approved" });
  }

     reservation.status = 'confirmed'
     reservation.updatedAt = Date.now()
     await reservation.save()

     res.json({ success: true, message: "Reservation approved", data: reservation });

   } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
   }
}

export const rejectReservation = async(req, res, next)=>{
   try {
      const {id} =  req.params
      const reservation = await Reservation.findById(id)

      if (!reservation) {
         return res.status(404).json({ success: false, message: "Reservation not found" });
     }

     if (reservation.status !== 'pending') {
      return res.status(400).json({ success: false, message: "Only pending reservations can be rejected" });
     }

      reservation.status = 'rejected'
      reservation.updatedAt = Date.now()
      await reservation.save()
 
      res.json({ success: true, message: "Reservation approved", data: reservation });

  
   } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
   }
}

// getPendingReservations 

export const getPendingReservations  = async(req, res, next)=>{
   try {
      
      const pendingReservations = await Reservation.find({ status: 'pending' }).populate('car user')
      res.json({ success: true, message: "Pending reservations fetched", data: pendingReservations });

   } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
   }
}



export const getAllReservations = async(req, res, next)=>{
   try {
      
   const reservation = await Reservation.find().populate('car').populate('user')

   res.json({ success: true, message: "Reservation fetched successfully", data: reservation });

   } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
   }
}

// Get reservations for a specific user
export const getUserReservation = async(req, res, next)=>{
   try {
      const {userId} = req.params

      const reservations = await Reservation.find({user : userId}).populate('car')

      if (reservations.length === 0) {
         return res.status(404).json({ success: false, message: "No reservations found for this user" });
     }

      res.json({ success: true, message: "User reservations fetched successfully", data: reservations }); 

   } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
   }
}

//update Reservation

export const updateReservation = async (req, res, next) => {
   try {
       const { id } = req.params; 
       const { startDate, endDate } = req.body;

       // Convert the string dates to Date objects
       const parsedStartDate = new Date(startDate.split('-').reverse().join('-'));
       const parsedEndDate = new Date(endDate.split('-').reverse().join('-'));

       const reservation = await Reservation.findById(id);

       if (!reservation) {
           return res.status(404).json({ success: false, message: "Reservation not found" });
       }

       if (reservation.status !== 'pending') {
           return res.status(400).json({ success: false, message: "Cannot update a reservation that is not pending" });
       }

       // Update the reservation details
       reservation.startDate = parsedStartDate;
       reservation.endDate = parsedEndDate;
       reservation.updatedAt = Date.now();

       await reservation.save();

       res.json({ success: true, message: "Reservation updated successfully", data: reservation });
   } catch (error) {
       console.error("Error updating reservation:", error.message);
       res.status(500).json({ success: false, message: error.message || "Internal server error" });
   }
};





// Cancel a reservation

export const cancelReservation = async (req, res,next)=>{
   try {
      
     const {id} = req.params

     const reservation = await Reservation.findById(id);

     if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
  }

  if(reservation.status === 'completed'){
   return res.status(400).json({ success: false, message: "Cannot cancel a completed reservation" });
  }
 
  await Reservation.findByIdAndDelete(id)

//   reservation.status = 'cancelled';
//   reservation.updatedAt = Date.now();

//   await reservation.save();
    
  res.json({ success: true, message: "Reservation canceled successfully", data: reservation });

   } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
   }
}






export const getUserReservations = async (req, res) => {
   try {
       const userId = req.user.id;

       
       // Fetch reservations associated with the user
       const reservations = await Reservation.find({ user: userId }).populate('car', 'make model images');

       if (!reservations.length) {
           return res.status(404).json({ success: false, message: "No reservations found for this user" });
       }

       res.json({ success: true, message: "User reservations fetched successfully", data: reservations });
   } catch (error) {
       console.error('Error fetching user reservations:', error.message);
       res.status(500).json({ success: false, message: error.message || "Internal server error" });
   }
};


export const getDealerCarReservation =async(req, res, next)=>{
   try {

      const dealerId = req.user.id

      const dealerCars = await Car.find({dealer : dealerId}).select('_id')

      const reservations = await Reservation.find({car : {$in : dealerCars}})
      .populate('car', 'make model images')
      .populate('user' , 'name email')


      res.status(200).json({success : true, message : "Reservations fetched successfully", data : reservations})

   } catch (error) {
      console.error("Error fetching dealer reservations:", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
   }
}