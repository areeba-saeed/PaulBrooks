const Categories = require("../model/categoryModel");

// Get all Categories
const getCategories = async (req, res) => {
  const categories = await Categories.find().select("name image").lean();
  res.json(categories);
};

// Post Category
const setCategory = async (req, res) => {
  const name = req.body.name;
  const image = req.file.filename;

  const newCategory = new Categories({
    name,
    image,
  });
  newCategory
    .save()
    .then(() => {
      res.send(`Category Added ${image}`);
    })
    .catch((err) => res.status(400).json({ error: err }));
};

// Update Category
const updateCategories = (req, res) => {
  Categories.findById(req.params.id)
    .then((category) => {
      category.name = req.body.name;

      if (req.file) {
        category.image = req.file.filename;
      }
      category
        .save()
        .then(() => {
          res.send("Category updated");
        })
        .catch((err) => res.status(400).json({ error: err }));
    })
    .catch((err) => res.status(400).json({ error: err }));
};
// Delete Category
const deleteCategories = (req, res) => {
  Categories.findByIdAndDelete(req.params.id)
    .then(() => {
      return Categories.find();
    })
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => res.status(400).json({ error: err }));
};

module.exports = {
  getCategories,
  deleteCategories,
  updateCategories,
  setCategory,
};
