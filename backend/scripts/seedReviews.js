/**
 * Seed script to create 15 dummy approved reviews
 * Run: node backend/scripts/seedReviews.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Review = require('../models/Review');

// Dummy reviews data (from ReviewSection.jsx)
const dummyReviews = [
  { name: "Vijay", role: "Donor", text: "Food Loop is an amazing initiative. Donating excess food was simple." },
  { name: "Anita S.", role: "Driver", text: "Being part of the distribution team has been the most fulfilling experience." },
  { name: "Grand Hotel", role: "Donor", text: "We drastically reduced our food waste thanks to their efficient pickup system." },
  { name: "Suresh K.", role: "Driver", text: "The app makes navigation to pickup points seamless and quick." },
  { name: "Meera R.", role: "Donor", text: "I love transparency. Knowing exactly where my donation went is priceless." },
  { name: "City Bakery", role: "Donor", text: "Finally a reliable way to ensure our unsold bread helps the community." },
  { name: "Rahul T.", role: "Receiver", text: "Connecting donors to those in need—Food Loop bridges the gap perfectly." },
  { name: "Community Kitchen", role: "Receiver", text: "The consistent supply of fresh vegetables has helped us feed hundreds more." },
  { name: "Priya M.", role: "Donor", text: "Super intuitive application. It took me 2 minutes to list my donation." },
  { name: "Arun D.", role: "Driver", text: "Every trip feels meaningful. This platform is a game changer." },
  { name: "Kavya L.", role: "Donor", text: "A wonderful way to share blessings on special occasions like birthdays." },
  { name: "Green Grocers", role: "Donor", text: "Zero waste goal is now achievable. Highly recommend Food Loop." },
  { name: "Vikram S.", role: "Driver", text: "Seeing the smiles on children's faces when we deliver is everything." },
  { name: "Sarah J.", role: "Donor", text: "Effective, transparent, and impactful. Keep up the great work!" },
  { name: "Noor F.", role: "Receiver", text: "We are grateful for the support. It makes a huge difference in our daily supplies." },
];

async function seedReviews() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodloop';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if reviews already exist
    const existingCount = await Review.countDocuments({ status: 'approved' });
    if (existingCount >= 15) {
      console.log(`⚠️  Already have ${existingCount} approved reviews. Skipping seed.`);
      await mongoose.connection.close();
      return;
    }

    // Delete existing dummy reviews (optional - comment out if you want to keep them)
    // await Review.deleteMany({ status: 'approved' });
    // console.log('🗑️  Cleared existing approved reviews');

    // Create reviews
    const reviewsToCreate = dummyReviews.map((review, index) => ({
      userId: new mongoose.Types.ObjectId(), // Dummy user ID
      userRole: review.role,
      userName: review.name,
      reviewText: review.text,
      status: 'approved',
      approvedBy: new mongoose.Types.ObjectId(), // Dummy admin ID
      approvedAt: new Date(Date.now() - (15 - index) * 24 * 60 * 60 * 1000), // Stagger dates
      createdAt: new Date(Date.now() - (15 - index) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - (15 - index) * 24 * 60 * 60 * 1000),
    }));

    const createdReviews = await Review.insertMany(reviewsToCreate);
    console.log(`✅ Created ${createdReviews.length} dummy approved reviews`);

    // Display summary
    const donorCount = createdReviews.filter(r => r.userRole === 'Donor').length;
    const receiverCount = createdReviews.filter(r => r.userRole === 'Receiver').length;
    const driverCount = createdReviews.filter(r => r.userRole === 'Driver').length;

    console.log('\n📊 Summary:');
    console.log(`   Donors: ${donorCount}`);
    console.log(`   Receivers: ${receiverCount}`);
    console.log(`   Drivers: ${driverCount}`);
    console.log(`   Total: ${createdReviews.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run seed
seedReviews();
