import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from '../models/Bus.js';

dotenv.config();

const buses = [
  {
    name: 'VRL Travels',
    operator: 'VRL Travels',
    from: 'Mumbai',
    to: 'Pune',
    departureTime: '22:00',
    arrivalTime: '05:30',
    duration: '7h 30m',
    price: 450,
    totalSeats: 40,
    busType: 'AC Sleeper',
    amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle'],
    rating: 4.5,
  },
  {
    name: 'SRS Travels',
    operator: 'SRS Travels',
    from: 'Mumbai',
    to: 'Pune',
    departureTime: '23:30',
    arrivalTime: '06:00',
    duration: '6h 30m',
    price: 350,
    totalSeats: 40,
    busType: 'Non-AC Sleeper',
    amenities: ['Charging Point', 'Water Bottle'],
    rating: 3.8,
  },
  {
    name: 'Orange Travels',
    operator: 'Orange Travels',
    from: 'Mumbai',
    to: 'Pune',
    departureTime: '06:00',
    arrivalTime: '10:30',
    duration: '4h 30m',
    price: 550,
    totalSeats: 40,
    busType: 'Volvo AC',
    amenities: ['WiFi', 'Charging Point', 'Snacks', 'Blanket'],
    rating: 4.7,
  },
  {
    name: 'Parveen Travels',
    operator: 'Parveen Travels',
    from: 'Chennai',
    to: 'Bangalore',
    departureTime: '21:00',
    arrivalTime: '04:00',
    duration: '7h 00m',
    price: 500,
    totalSeats: 40,
    busType: 'AC Sleeper',
    amenities: ['WiFi', 'Charging Point', 'Blanket'],
    rating: 4.2,
  },
  {
    name: 'KPN Travels',
    operator: 'KPN Travels',
    from: 'Chennai',
    to: 'Bangalore',
    departureTime: '22:30',
    arrivalTime: '05:30',
    duration: '7h 00m',
    price: 400,
    totalSeats: 40,
    busType: 'AC Seater',
    amenities: ['Charging Point', 'Water Bottle'],
    rating: 4.0,
  },
  {
    name: 'Greenline Travels',
    operator: 'Greenline Travels',
    from: 'Delhi',
    to: 'Jaipur',
    departureTime: '07:00',
    arrivalTime: '12:30',
    duration: '5h 30m',
    price: 600,
    totalSeats: 40,
    busType: 'Volvo AC',
    amenities: ['WiFi', 'Charging Point', 'Snacks'],
    rating: 4.6,
  },
  {
    name: 'Rajasthan Roadways',
    operator: 'Rajasthan Roadways',
    from: 'Delhi',
    to: 'Jaipur',
    departureTime: '09:00',
    arrivalTime: '14:30',
    duration: '5h 30m',
    price: 300,
    totalSeats: 40,
    busType: 'Non-AC Seater',
    amenities: ['Water Bottle'],
    rating: 3.5,
  },
  {
    name: 'Neeta Travels',
    operator: 'Neeta Travels',
    from: 'Ahmedabad',
    to: 'Mumbai',
    departureTime: '20:00',
    arrivalTime: '05:00',
    duration: '9h 00m',
    price: 700,
    totalSeats: 40,
    busType: 'AC Sleeper',
    amenities: ['WiFi', 'Charging Point', 'Blanket', 'Snacks'],
    rating: 4.4,
  },
  {
    name: 'Paulo Travels',
    operator: 'Paulo Travels',
    from: 'Goa',
    to: 'Mumbai',
    departureTime: '18:00',
    arrivalTime: '06:00',
    duration: '12h 00m',
    price: 900,
    totalSeats: 40,
    busType: 'Volvo AC',
    amenities: ['WiFi', 'Charging Point', 'Blanket', 'Snacks', 'Water Bottle'],
    rating: 4.8,
  },
  {
    name: 'Konduskar Travels',
    operator: 'Konduskar Travels',
    from: 'Goa',
    to: 'Mumbai',
    departureTime: '20:30',
    arrivalTime: '08:30',
    duration: '12h 00m',
    price: 650,
    totalSeats: 40,
    busType: 'AC Sleeper',
    amenities: ['Charging Point', 'Blanket', 'Water Bottle'],
    rating: 4.1,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Bus.deleteMany({});
    await Bus.insertMany(buses);
    console.log(`✅ Seeded ${buses.length} buses successfully`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
