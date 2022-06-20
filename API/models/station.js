const mongoose = require('mongoose');
const stationSchema = mongoose.Schema({
    stationName: String,
    phoneNumber: String,
    address: {},
    type:{},
    openStatusText: String,
    addressLines: Array,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

stationSchema.index({ location: '2dsphere'},{sparse: true});
module.exports = mongoose.model('Station',stationSchema);
