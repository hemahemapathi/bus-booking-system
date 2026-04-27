import PDFDocument from 'pdfkit';

export const generateTicketPDF = (booking, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.fontSize(22).font('Helvetica-Bold').text('Bus Booking Ticket', { align: 'center' });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Booking Info
    doc.fontSize(12).font('Helvetica');
    const info = [
      ['Booking ID', booking.bookingId],
      ['Passenger Name', user.name],
      ['Email', user.email],
      ['Bus', booking.bus.name],
      ['Operator', booking.bus.operator],
      ['From', booking.bus.from],
      ['To', booking.bus.to],
      ['Date', booking.date],
      ['Departure', booking.bus.departureTime],
      ['Arrival', booking.bus.arrivalTime],
      ['Bus Type', booking.bus.busType],
      ['Seats', booking.seats.join(', ')],
      ['Total Price', `Rs. ${booking.totalPrice}`],
      ['Status', booking.status.toUpperCase()],
    ];

    info.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(`${label}: `, { continued: true });
      doc.font('Helvetica').text(value);
    });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Passengers
    doc.fontSize(14).font('Helvetica-Bold').text('Passengers');
    doc.moveDown(0.3);
    booking.passengers.forEach((p, i) => {
      doc.fontSize(12).font('Helvetica').text(
        `${i + 1}. ${p.name}  |  Age: ${p.age}  |  Gender: ${p.gender}`
      );
    });

    doc.moveDown();
    doc.fontSize(10).font('Helvetica').fillColor('gray').text(
      'This is a computer-generated ticket. No signature required.',
      { align: 'center' }
    );

    doc.end();
  });
};
