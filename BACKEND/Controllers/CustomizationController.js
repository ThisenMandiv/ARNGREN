import Customization from '../Model/Customization.js';

// Create
export const createCustomization = async (req, res) => {
  try {
    const customization = new Customization(req.body);
    await customization.save();
    res.status(201).json(customization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read (Get All)
export const getAllCustomizations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    const customizations = await Customization.find(filter);
    res.json(customizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read (Get One)
export const getCustomization = async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id);
    if (!customization) return res.status(404).json({ message: 'Not found' });
    res.json(customization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateCustomization = async (req, res) => {
  try {
    const customization = await Customization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customization) return res.status(404).json({ message: 'Not found' });
    res.json(customization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Status
export const updateCustomizationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: Pending, In Progress, Completed' 
      });
    }

    const customization = await Customization.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!customization) {
      return res.status(404).json({ message: 'Customization not found' });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      customization
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating status',
      error: error.message 
    });
  }
};

// Delete
export const deleteCustomization = async (req, res) => {
  try {
    const customization = await Customization.findByIdAndDelete(req.params.id);
    if (!customization) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Customization deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};