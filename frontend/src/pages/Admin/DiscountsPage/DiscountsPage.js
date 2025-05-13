import { useState, useEffect } from 'react';
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from '../../../services/discountService';
import DiscountList from '../../../Components/discounts/DiscountList';
import DiscountForm from '../../../Components/discounts/DiscountForm';
import Modal from '../../../Components/ui/Modal';
import Button from '../../../Components/ui/Button';
import Toast from '../../../Components/ui/Toast';
import useToast from '../../../hooks/useToast';
import './DiscountsPage.css';

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setIsLoading(true);
    try {
      const data = await getDiscounts();
      setDiscounts(data);
    } catch (error) {
      showToast('error', 'Failed to load discounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (discountData) => {
    try {
      if (currentDiscount) {
        await updateDiscount(currentDiscount._id, discountData);
        showToast('success', 'Discount updated successfully');
      } else {
        await createDiscount(discountData);
        showToast('success', 'Discount created successfully');
      }
      fetchDiscounts();
      setIsModalOpen(false);
    } catch (error) {
      showToast('error', error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDiscount(id);
      showToast('success', 'Discount deleted successfully');
      fetchDiscounts();
    } catch (error) {
      showToast('error', 'Failed to delete discount');
    }
  };

  return (
    <div className="discounts-container">
      <div className="discounts-header">
        <h1 className="discounts-title">Discounts Management</h1>
        <Button onClick={() => {
          setCurrentDiscount(null);
          setIsModalOpen(true);
        }}>
          Create Discount
        </Button>
      </div>

      {isLoading && discounts.length === 0 ? (
        <div className="discounts-loading">
          <p>Loading discounts...</p>
        </div>
      ) : (
        <DiscountList
          discounts={discounts}
          onEdit={(discount) => {
            setCurrentDiscount(discount);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDiscount ? 'Edit Discount' : 'Create Discount'}
      >
        <DiscountForm
          initialValues={currentDiscount}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Toast 
        type={toast.type} 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={hideToast} 
      />
    </div>
  );
};

export default DiscountsPage; 