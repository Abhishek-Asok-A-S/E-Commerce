const mongoose = require('mongoose');

// MongoDB connection string
const url = 'mongodb://127.0.0.1:27017/my-pro';//database name

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Define a schema for the user collection
    const adminSchema = new mongoose.Schema({
        name : {type:String , required: true},
        password : {type:String, required:true},
        email : {type:String, required:true},
    })
 

    // Create a model for the user collection based on the schema
    const AdminCollection = mongoose.model('admin',adminSchema)

    // Define an array of predefined user data
    const predefinedUserData = [
      {
       name:'admin',
       password:'1234',
       email:'admin@gmail.com'
      }
    ]
     


    // Insert the predefined user data into the collection
    AdminCollection.insertMany(predefinedUserData)
      .then(() => {
        console.log('Predefined user data saved to MongoDB');

        // Close the MongoDB connection
        mongoose.connection.close();
        console.log('MongoDB connection closed');
      })
      .catch((error) => {
        console.error('Error saving predefined user data:', error);
      });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});