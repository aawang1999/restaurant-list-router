const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list-restful-router', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.error('MongoDB error.')
})

db.once('open', () => {
  console.log('MongoDB connected.')
})

module.exports = db