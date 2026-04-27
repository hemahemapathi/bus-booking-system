import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingConfirmationEmail = async (booking, user) => {
  const passengerList = booking.passengers
    .map((p, i) => `${i + 1}. ${p.name} (Age: ${p.age}, Gender: ${p.gender})`)
    .join('\n');

  await transporter.sendMail({
    from: `"Bus Booking" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Booking Confirmed - ${booking.bookingId}`,
    html: `
      <h2>Booking Confirmed! 🎉</h2>
      <p>Hi ${user.name},</p>
      <p>Your booking has been confirmed. Here are your details:</p>
      <table border="1" cellpadding="8" cellspacing="0">
        <tr><td><b>Booking ID</b></td><td>${booking.bookingId}</td></tr>
        <tr><td><b>Bus</b></td><td>${booking.bus.name}</td></tr>
        <tr><td><b>From</b></td><td>${booking.bus.from}</td></tr>
        <tr><td><b>To</b></td><td>${booking.bus.to}</td></tr>
        <tr><td><b>Date</b></td><td>${booking.date}</td></tr>
        <tr><td><b>Departure</b></td><td>${booking.bus.departureTime}</td></tr>
        <tr><td><b>Seats</b></td><td>${booking.seats.join(', ')}</td></tr>
        <tr><td><b>Total Price</b></td><td>₹${booking.totalPrice}</td></tr>
      </table>
      <h4>Passengers:</h4>
      <pre>${passengerList}</pre>
      <p>Thank you for booking with us!</p>
    `,
  });
};
