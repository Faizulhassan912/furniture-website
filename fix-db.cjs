const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://fm4133196_db_user:dGNq9bdZiLBt2IWU@cluster0.oaxvpmk.mongodb.net/sns_kids_furniture?retryWrites=true&w=majority';

async function updateDB() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const db = mongoose.connection.db;

    // Get the first product
    const product = await db.collection('products').findOne({});
    if (product) {
      console.log('Found product:', product.name, product.slug);
      
      // Update banners
      const bannerColl = db.collection('settings'); // assuming banners are stored in settings
      const settings = await bannerColl.findOne({});
      
      if (settings && settings.banners) {
        console.log('Found banners setting');
        const customBanner = settings.banners.customBanner;
        
        await bannerColl.updateOne({}, {
          $set: { 'banners.customBanner.buttonLink': '/collection/' + product.slug }
        });
        console.log('Banner forcefully updated to valid product!');
        
      } else {
        console.log('No banners settings found in db.');
      }
    } else {
      console.log('No products found in DB!');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

updateDB();
