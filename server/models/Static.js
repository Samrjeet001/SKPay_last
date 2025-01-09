// import mongoose from 'mongoose';

// const staticSchema = new mongoose.Schema({
//     currentrate: { type: Number, default: 0 },
// }, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// const StaticVaraible = mongoose.model('static', staticSchema); // Removed extra space in 'User  '

// export default StaticVaraible;


import mongoose from 'mongoose';

const staticSchema = new mongoose.Schema({
    currentrate: { type: Number, default: 0 },
    address:{type: String,default : 0},
    network:{type: String,default : 0},
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const StaticVaraible = mongoose.model('static', staticSchema); // Removed extra space in 'User  '

export default StaticVaraible;
