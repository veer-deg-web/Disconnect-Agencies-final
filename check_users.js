const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkUsers() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found');
        process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({
        name: String,
        email: String,
        role: String
    }));
    
    const allUsers = await User.find({});
    console.log('Total Users:', allUsers.length);
    allUsers.forEach(u => {
        console.log(`- ${u.name} (${u.email}): role=${u.role}`);
    });
    process.exit(0);
}

checkUsers();
