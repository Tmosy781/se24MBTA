const express = require("express");
const router = express.Router();
const { z } = require('zod');
const Favorite = require("../models/favoriteModel");

const createFavoriteSchema = z.object({
  userID: z.string().nonempty(),
  line: z.string(),
  station: z.string(),
});

router.post("/", async (req, res) => {
  try {
    const { userID, line, station } = createFavoriteSchema.parse(req.body);

    const existingFavorite = await Favorite.findOne({ userID, line, station });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Favorite already exists' });
    }

    const newFavorite = new Favorite({
      userID,
      line,
      station,
    });

    await newFavorite.save();
    res.status(201).json({ message: 'Favorite added successfully', favorite: newFavorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues[0].message });
    } else {
      res.status(500).json({ message: 'Failed to add favorite' });
    }
  }
});

module.exports = router;