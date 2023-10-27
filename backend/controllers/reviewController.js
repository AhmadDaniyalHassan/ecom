// import reviewModel from "../models/reviewModel.js";
// import productModel from "../models/productModel.js";

// export const getReviewController = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const reviews = await reviewModel.find({ product: productId });

//     if (!reviews || reviews.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No reviews found for the product." });
//     }

//     res.json(reviews);
//   } catch (err) {
//     res
//       .status(500)
//       .send({ success: false, err, message: "Erroer in Fetching Review" });
//   }
// };

// export const createReviewController = async (req, res) => {
//   try {
//     const newReview = await Review.create(req.body);
//     res.status(201).json(newReview);
//   } catch (err) {
//     res
//       .status(500)
//       .send({ success: false, err, message: "Error In Creating Reviews" });
//   }
// };

// export const updateReviewController = async (req, res) => {
//   try {
//     const { review } = req.body;
//     const reviews = reviewModel.findByIdAndUpdate(review._id, review, {
//       new: true,
//     });
//     res.status(200).send({
//       success: true,
//       message: "Successfully Updated Reviews",
//       reviews,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ success: false, error, message: "Error In Updating Reviews" });
//   }
// };

// export const deleteReviewController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const reviews = await reviewModel.findByIdAndDelete(id);
//     res.status(200).send({
//       success: true,
//       message: "Successfully Deleted Reviews",
//       reviews,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ success: false, error, message: "Error In Deleting Reviews" });
//   }
// };
