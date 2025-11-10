const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Houses Array with placeholder images
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
app.get('/api/houses', (req, res) => {
  res.json(houses);
});

app.get('/api/houses/:id', (req, res) => {
  const house = houses.find(h => h._id === parseInt(req.params.id));
  if (house) {
    res.json(house);
  } else {
    res.status(404).json({ message: 'House not found' });
  }
});

// Serve static files from public folder
app.use(express.static('public'));

// Root route - API Documentation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});