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
    const { name, description, subcategories } = req.body;
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
      description: description || '',
      subcategories: Array.isArray(subcategories) ? subcategories : []
    });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Failed to create category' });
  }
};

// --- Update category (main name, description, subcategories) ---
export const updateCategory = async (req, res) => {
  try {
    const { name, description, subcategories } = req.body;
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
        description: description || '',
        subcategories: Array.isArray(subcategories) ? subcategories : existingCategory.subcategories
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
    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};

// --- Add subcategory ---
export const addSubcategory = async (req, res) => {
  try {
    const { subcategory } = req.body;
    const categoryId = req.params.id;
    if (!subcategory) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (category.subcategories.includes(subcategory)) {
      return res.status(400).json({ message: 'Subcategory already exists' });
    }
    category.subcategories.push(subcategory);
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    console.error('Error adding subcategory:', err);
    res.status(500).json({ message: 'Failed to add subcategory' });
  }
};

// --- Update subcategory ---
export const updateSubcategory = async (req, res) => {
  try {
    const { oldName, newName } = req.body;
    const categoryId = req.params.id;
    if (!oldName || !newName) {
      return res.status(400).json({ message: 'Both old and new subcategory names are required' });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const idx = category.subcategories.indexOf(oldName);
    if (idx === -1) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    category.subcategories[idx] = newName;
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    console.error('Error updating subcategory:', err);
    res.status(500).json({ message: 'Failed to update subcategory' });
  }
};

// --- Delete subcategory ---
export const deleteSubcategory = async (req, res) => {
  try {
    const { subcategory } = req.body;
    const categoryId = req.params.id;
    if (!subcategory) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    category.subcategories = category.subcategories.filter(sub => sub !== subcategory);
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    console.error('Error deleting subcategory:', err);
    res.status(500).json({ message: 'Failed to delete subcategory' });
  }
}; 