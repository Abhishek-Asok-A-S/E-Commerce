const mongoose = require('mongoose');

// MongoDB connection string
const url = 'mongodb://127.0.0.1:27017/my-pro';//database name

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Define a schema for the user collection
    const bannerSchema = new mongoose.Schema({
      name : {type : String, required : true},
      path : { type:[String],maxLength : 3}
  })
  
 

    // Create a model for the user collection based on the schema
        const BannerCollections = mongoose.model('banners',bannerSchema)

    // Define an array of predefined user data
    const predefinedUserData = [
      {
       name:'homepage_top_banner',
       path:'/assets\banners\1691935526967-lilian-dibbern-ftwDuke2UgA-unsplash.jpg'
      }
    ]
     


    // Insert the predefined user data into the collection
    BannerCollections.insertMany(predefinedUserData)
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
