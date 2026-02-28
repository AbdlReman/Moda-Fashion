// Script to fix vendors with invalid coordinates
// Run with: node scripts/fix-vendor-coordinates.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Read MongoDB connection string from .env.local
function getMongoUri() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch (error) {
    console.error('Error reading .env.local:', error.message);
  }
  return null;
}

const MONGODB_URI = getMongoUri();

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

const LocationSchema = new mongoose.Schema(
  {
    city: { type: String, index: true, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    address: { type: String, trim: true },
    coordinates: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] }
    }
  },
  { _id: false }
);

const VendorSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    slug: { type: String, required: true },
    location: { type: LocationSchema, default: undefined }
  },
  { timestamps: true, strict: false }
);

VendorSchema.set('collection', 'vendors');

async function fixVendorCoordinates() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    const Vendor = mongoose.model('Vendor', VendorSchema);

    // Find all vendors with invalid coordinates (coordinates object exists but coordinates array is missing)
    const vendors = await Vendor.find({
      'location.coordinates.type': 'Point',
      'location.coordinates.coordinates': { $exists: false }
    });

    console.log(`Found ${vendors.length} vendors with invalid coordinates`);

    for (const vendor of vendors) {
      console.log(`Fixing vendor: ${vendor.businessName} (${vendor._id})`);
      
      // Remove the coordinates object entirely, keep only city
      const updateData = {
        location: {
          city: vendor.location?.city || '',
          state: vendor.location?.state,
          country: vendor.location?.country,
          address: vendor.location?.address
        }
      };

      // Remove undefined fields
      Object.keys(updateData.location).forEach(key => {
        if (updateData.location[key] === undefined) {
          delete updateData.location[key];
        }
      });

      await Vendor.updateOne(
        { _id: vendor._id },
        { $set: updateData }
      );
      
      console.log(`✓ Fixed vendor: ${vendor.businessName}`);
    }

    console.log('\nAll vendors fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing vendors:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

fixVendorCoordinates();

