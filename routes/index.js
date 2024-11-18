var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const Car = require('../models/car');


//Kết nối mongodb
const mongodb = 'mongodb+srv://sangnvph20103:Sang2003@cardatabase.kypx8.mongodb.net/?retryWrites=true&w=majority&appName=cardatabase'
const mongoose = require('mongoose');
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
  console.log('Connected to MongoDB');
}).catch(err=>{
  console.log(err);
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('form', { errors: null });
});

router.post('/add',
    [
      body('MaXe').notEmpty().withMessage('MaXe không được để trống'),
      body('Name').notEmpty().withMessage('Name không được để trống').matches(/^[A-Za-z\s]+$/).withMessage('Name phải là chữ'),
      body('Price').notEmpty().withMessage('Price không được để trống').isNumeric().withMessage('Price phải là số'),
      body('Year').notEmpty().withMessage('Year không được để trống').isInt({ min: 1980, max: 2024 }).withMessage('Year phải từ 1980 đến 2024'),
      body('Brand').notEmpty().withMessage('Brand không được để trống')
    ],
    async (req, res) => { // Thêm 'async' ở đây
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('form', { errors: errors.array() });
      }

      const car = new Car({
        MaXe: req.body.MaXe,
        Name: req.body.Name,
        Price: req.body.Price,
        Year: req.body.Year,
        Brand: req.body.Brand
      });

      try {
        await car.save(); // Sử dụng 'await' thay vì callback
        res.redirect('/cars');
      } catch (err) {
        console.log(err);
        res.status(500).send('Đã xảy ra lỗi khi lưu dữ liệu');
      }
    }
);
// GET danh sách ô tô
router.get('/cars', (req, res) => {
  Car.find({})
      .then(cars => {
        res.render('cars', { cars: cars });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send('Đã xảy ra lỗi khi lấy danh sách ô tô');
      });
});

// API trả về danh sách ô tô dạng JSON với điều kiện
router.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find({}); // Không sử dụng callback
    res.send(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
