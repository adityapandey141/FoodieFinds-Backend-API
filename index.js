const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
app.use(express.static('static'));
app.use(cors());

let db;
(async () => {
  db = await open({
    filename: './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function getAll() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await getAll();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found !' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getById(id) {
  let query = 'SELECT * FROM restaurants WHERE id=?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}
app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseFloat(req.params.id);
  try {
    let result = await getById(id);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `No restaurants found with id ${id}!` });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine=?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await getByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `No restaurants found with Cuisine ${cuisine}!` });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getByFilter(veg, outdoor, luxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg=? AND hasOutdoorSeating=? AND isLuxury=?';
  let response = await db.all(query, [veg, outdoor, luxury]);
  return { restaurants: response };
}
app.get('/restaurants/filter', async (req, res) => {
  let veg = req.query.isVeg;
  let outdoor = req.query.hasOutdoorSeating;
  let luxury = req.query.isLuxury;
  try {
    let result = await getByFilter(veg, outdoor, luxury);
    if (result.restaurants.length === 0) {
      return res.status(404).json({
        message: `No restaurants found with these filters isVeg ${veg} hasOutdoorSeating ${outdoor} isLuxury ${luxury}!`,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getSortByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await getSortByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found !' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await getAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found !' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id=?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}
app.get('/dishes/details/:id', async (req, res) => {
  let id = parseFloat(req.params.id);
  try {
    let result = await getDishesById(id);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `No dishes found with id ${id}!` });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg=?';
  let response = await db.all(query, [isVeg]);
  return { restaurants: response };
}
app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await getDishesByFilter(isVeg);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `No dishes found with filter isVeg = ${isVeg}!` });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ASC ';
  let response = await db.all(query, []);
  return { restaurants: response };
}
app.get('/dishes/sort-by-price', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await getDishesByPrice();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: `No dishes found !` });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
