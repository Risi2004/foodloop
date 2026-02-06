/**
 * Socket.IO service for real-time driver location to donor/receiver.
 * Call setIO(io) from server.js, then emitDriverLocation(driverId, lat, lng) when driver location updates.
 */

let io = null;
let Donation = null;

function getDonationModel() {
  if (!Donation) {
    Donation = require('../models/Donation');
  }
  return Donation;
}

/**
 * Attach Socket.IO instance (call once from server.js).
 * @param {import('socket.io').Server} socketIO
 */
function setIO(socketIO) {
  io = socketIO;
}

/**
 * Emit driver location to all donor/receiver clients tracking donations for this driver.
 * Call after updating User.driverLatitude/driverLongitude (PATCH /me/location or demo tick).
 * @param {string} driverId - MongoDB ObjectId of the driver user
 * @param {number} latitude
 * @param {number} longitude
 */
async function emitDriverLocation(driverId, latitude, longitude) {
  if (!io) return;

  try {
    const DonationModel = getDonationModel();
    const donations = await DonationModel.find({
      assignedDriverId: driverId,
      status: { $in: ['assigned', 'picked_up'] },
    })
      .select('_id')
      .lean();

    const payload = {
      driverLocation: { latitude, longitude },
    };

    for (const d of donations) {
      const room = `donation:${d._id.toString()}`;
      io.to(room).emit('driver_location', payload);
    }
  } catch (err) {
    console.error('[SocketService] emitDriverLocation error:', err);
  }
}

module.exports = {
  setIO,
  emitDriverLocation,
};
