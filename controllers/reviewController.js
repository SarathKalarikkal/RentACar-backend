import { Review } from "../models/reviewModel.js";
import { Car } from "../models/carModel.js";


export const createReview = async(req, res, next)=>{
    try {
        const { rating, comment } = req.body;
        const {carId} = req.params

        const userId = req.user.id;

        
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Valid rating (1-5) is required" });
        }

        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment is required" });
        }
         
        const car = await Car.findById(carId)

        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found" });
        }
         // Check if the user has already reviewed this car
        const existingReview = await Review.findOne({ car: carId, user: userId });
         if (existingReview) {
             return res.status(409).json({ success: false, message: "You have already reviewed this car" });
         }

        const newReview = await Review.create({
            car: carId,
            user: userId,
            rating,
            comment
        });

       
       await newReview.save();
       

       car.reviews.push(newReview);
       await car.save();

       res.status(201).json({ success: true, message: "Review created successfully", data: newReview, car});
        
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
}


export const getReviews = async(req, res, next)=>{
    try {

        const { carId } = req.params;

        const reviews = await Review.find({car : carId}).populate('user', 'name')

        if(!reviews.length){
            return res.status(404).json({ success: false, message: "No reviews found for this car" });
        }

        res.json({ success: true, message: "Car reviews fetched successfully", data: reviews });

        
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
}


export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params; 
        const { rating, comment } = req.body; 

        
        const userId = req.user.id;

       
        const review = await Review.findById(reviewId);

        
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "User not authorized to update this review" });
        }

        
        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        review.updatedAt = Date.now();

       
        await review.save();

        res.json({ success: true, message: "Review updated successfully", data: review });

    } catch (error) {
        console.error('Error updating review:', error.message);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};


export const deleteReview = async(req, res, next)=>{
    try {
        const { reviewId } = req.params;

        const userId = req.user.id;

        const review = await Review.findById(reviewId)

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "User not authorized to delete this review" });
        }

        await review.deleteOne();

        res.json({ success: true, message: "Review deleted successfully" });

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
}

// // Get all reviews for a specific user

// export const getUserReviews = async (req, res, next) => {
//     try {
//         const { userId } = req.params;

//         const reviews = await Review.find({ user: userId }).populate('car', 'make', ' model');

//         if (!reviews.length) {
//             return res.status(404).json({ success: false, message: "No reviews found for this user" });
//         }

//         res.json({ success: true, message: "User reviews fetched successfully", data: reviews });

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message || "Internal server error" });
//     }
// };