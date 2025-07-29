import Category from '../Model/Category.js';

// --- Get all categories ---
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// --- Get single category by ID ---
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
};

// --- Create new category ---
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name: name.trim(),
      description: description || ''
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Failed to create category' });
  }
};

// --- Update category ---
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const categoryId = req.params.id;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Check if category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name conflicts with existing category
    const nameConflict = await Category.findOne({ 
      name: name.trim(), 
      _id: { $ne: categoryId } 
    });
    if (nameConflict) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        name: name.trim(),
        description: description || ''
      },
      { new: true }
    );

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Failed to update category' });
  }
};

// --- Delete category ---
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // TODO: Check if category is being used by any ads
    // For now, we'll allow deletion
    // const adsUsingCategory = await Ad.countDocuments({ category: category.name });
    // if (adsUsingCategory > 0) {
    //   return res.status(400).json({ 
    //     message: `Cannot delete category. ${adsUsingCategory} ad(s) are using this category.` 
    //   });
    // }

    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Failed to delete category' });
  }
}; 