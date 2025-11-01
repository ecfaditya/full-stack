// ===============================
// Mongoose CRUD Example (Single File)
// ===============================

// 1️⃣ Import mongoose
const mongoose = require('mongoose');

// 2️⃣ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/companyDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Connection error:', err));

// 3️⃣ Define a Schema (like a table structure)
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: String,
    salary: Number,
    dateJoined: { type: Date, default: Date.now }
});

// 4️⃣ Create a Model (represents the collection)
const Employee = mongoose.model('Employee', employeeSchema);

// 5️⃣ CRUD Operations
async function runCRUD() {
    try {
        // ----- CREATE -----
        const newEmployee = new Employee({
            name: 'John Doe',
            department: 'IT',
            salary: 50000
        });
        const savedEmp = await newEmployee.save();
        console.log('\n✅ Created Employee:', savedEmp);

        // ----- READ -----
        const allEmployees = await Employee.find();
        console.log('\n📋 All Employees:', allEmployees);

        // ----- UPDATE -----
        const updatedEmp = await Employee.findOneAndUpdate(
            { name: 'John Doe' },
            { salary: 60000, department: 'Software' },
            { new: true }
        );
        console.log('\n🔁 Updated Employee:', updatedEmp);

        // ----- DELETE -----
        const deletedEmp = await Employee.findOneAndDelete({ name: 'John Doe' });
        console.log('\n🗑️ Deleted Employee:', deletedEmp);

    } catch (err) {
        console.error('❌ Error during CRUD operations:', err);
    } finally {
        // Close connection
        mongoose.connection.close();
        console.log('\n🔒 MongoDB connection closed');
    }
}

// 6️⃣ Run the function
runCRUD();
