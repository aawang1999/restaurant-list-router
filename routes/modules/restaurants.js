const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sortData = require('../../config/sortData.json')
const mongoose = require('mongoose')

router.get('/searches', (req, res) => {
  const searchInput = req.query.keyword
  const keyword = searchInput.trim().toLowerCase()
  const currentSortOption = req.query.sortOption
  const sortMongoose = {
    nameEnAsc: { name_en: 'asc' },
    nameEnDesc: { name_en: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' }
  }
  Restaurant.find()
    .lean()
    .sort(sortMongoose[currentSortOption])
    .then((restaurants) => {
      if (keyword) {
        restaurants = restaurants.filter((restaurant) =>
          restaurant.name.toLowerCase().includes(keyword) ||
          restaurant.category.includes(keyword))
      }
      if (restaurants.length === 0) {
        const error = 'No results found.'
        return res.render('index', { error })
      }
      res.render('index', { restaurants, sortData, currentSortOption, searchInput })
    })
    .catch((error) => console.error(error))
})

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  if (!name || !category || !image || !location || !phone || !google_map || !rating || !description) {
    return res.redirect('/restaurants/new')
  }
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch((error) => console.error(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  const modifiedRestaurant = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = modifiedRestaurant.name
      restaurant.name_en = modifiedRestaurant.name_en
      restaurant.category = modifiedRestaurant.category
      restaurant.image = modifiedRestaurant.image
      restaurant.location = modifiedRestaurant.location
      restaurant.phone = modifiedRestaurant.phone
      restaurant.google_map = modifiedRestaurant.google_map
      restaurant.rating = modifiedRestaurant.rating
      restaurant.description = modifiedRestaurant.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.error(error))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch((error) => console.error(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) return res.redirect('back')
  return Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router