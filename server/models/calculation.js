import mongoose from "mongoose";

const calculationSchema = new mongoose.Schema({
    formula: { type: String, required: true },
    result: { type: String, required: true },
    isValid: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Calculation = mongoose.model("Calculation", calculationSchema);

export default Calculation;
