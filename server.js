const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const Joi = require('joi');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => 
  {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => 
  {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Joi validation
const houseSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  size: Joi.number().integer().min(100).max(10000).required(),
  bedrooms: Joi.number().integer().min(1).max(20).required(),
  bathrooms: Joi.number().min(1).max(20).required(),
  features: Joi.array().items(Joi.string()).min(1).required()
});

// Houses Array
let houses = [
  {
    _id: 1,
    name: "Modern Oak Estate",
    size: 1800,
    bedrooms: 3,
    bathrooms: 2,
    features: [
      "Hardwood Floors",
      "Updated Kitchen",
      "Large Backyard",
      "Two-Car Garage"
    ],
    main_image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  },
  {
    _id: 2,
    name: "Pine Cottage",
    size: 1400,
    bedrooms: 2,
    bathrooms: 2,
    features: [
      "Garden",
      "Wrap Around Porch",
      "Recently Renovated"
    ],
    main_image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
  },
  {
    _id: 3,
    name: "Maple Modern",
    size: 2500,
    bedrooms: 4,
    bathrooms: 3,
    features: [
      "Smart Home Technology",
      "Gourmet Kitchen",
      "Master Suite",
      "Covered Deck"
    ],
    main_image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop",
  },
  {
    _id: 4,
    name: "Elm Traditional",
    size: 2100,
    bedrooms: 3,
    bathrooms: 2.5,
    features: [
      "Walk-in Closets",
      "Patio",
      "Two-Car Garage"
    ],
    main_image: "coming-soon.jpg",
  },
  {
    _id: 5,
    name: "Cedar Starter",
    size: 1200,
    bedrooms: 2,
    bathrooms: 1,
    features: [
      "Affordable",
      "Low Maintenance",
      "Central Location"
    ],
    main_image: "coming-soon.jpg",
  },
  {
    _id: 6,
    name: "Birch Estate",
    size: 3200,
    bedrooms: 5,
    bathrooms: 4,
    features: [
      "Pool",
      "Wine Cellar",
      "Home Theater",
      "Outdoor Kitchen"
    ],
    main_image: "coming-soon.jpg",
  }
];

// API Routes
app.get('/api/houses', (req, res) => 
{
  res.json(houses);
});

app.get('/api/houses/:id', (req, res) => 
{
  const house = houses.find(h => h._id === parseInt(req.params.id));
  if (house) 
  {
    res.json(house);
  } 
  else 
  {
    res.status(404).json({ message: 'House not found' });
  }
});

// POST endpoint to add a new house
app.post('/api/houses', upload.single('main_image'), (req, res) => 
{
  // Parse features if it's a string (from form data)
  const houseData = 
  {
    name: req.body.name,
    size: parseInt(req.body.size),
    bedrooms: parseInt(req.body.bedrooms),
    bathrooms: parseFloat(req.body.bathrooms),
    features: typeof req.body.features === 'string' 
      ? JSON.parse(req.body.features) 
      : req.body.features
  };

  // Validate the house data using Joi
  const { error, value } = houseSchema.validate(houseData);

  if (error) 
  {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(detail => detail.message)
    });
  }

  // Check if image was uploaded
  if (!req.file) 
  {
    return res.status(400).json({
      success: false,
      message: 'Image file is required'
    });
  }

  // Generate new ID
  const newId = houses.length > 0 ? Math.max(...houses.map(h => h._id)) + 1 : 1;

  // Create new house object
  const newHouse = 
  {
    _id: newId,
    ...value,
    main_image: req.file.filename
  };

  // Add to array
  houses.push(newHouse);

  // Return success response
  res.status(201).json({
    success: true,
    message: 'House added successfully',
    house: newHouse
  });
});

// Serve static files from public folder
app.use(express.static('public'));

// Root route - API Documentation
app.get('/', (req, res) => 
{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => 
{
  console.log(`Server running on port ${PORT}`);
});