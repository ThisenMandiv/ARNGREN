// PromotionsPage.js
import { useState, useEffect, useCallback } from 'react';
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '../../services/promotionService';
import PromotionList from '../../Components/promotions/PromotionList';
import PromotionForm from '../../Components/promotions/PromotionForm';
import Modal from '../../Components/ui/Modal';
import Button from '../../Components/ui/Button';
import Toast from '../../Components/ui/Toast';
import useToastNotification from '../../hooks/useToastNotification';
import './PromotionsPage.css';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToastNotification();

  const fetchPromotions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPromotions();
      setPromotions(data);
    } catch (error) {
      showToast('error', 'Failed to load promotions');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleSubmit = async (promotionData) => {
    try {
      if (currentPromotion) {
        await updatePromotion(currentPromotion._id, promotionData);
        showToast('success', 'Promotion updated successfully');
      } else {
        await createPromotion(promotionData);
        showToast('success', 'Promotion created successfully');
      }
      fetchPromotions();
      setIsModalOpen(false);
    } catch (error) {
      showToast('error', error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotion(id);
      showToast('success', 'Promotion deleted successfully');
      fetchPromotions();
    } catch (error) {
      showToast('error', 'Failed to delete promotion');
    }
  };

  return (
    <div className="promotions-container">
      <div className="header">
        <h1 className="title">Promotions Management</h1>
        <Button onClick={() => {
          setCurrentPromotion(null);
          setIsModalOpen(true);
        }}>
          Create Promotion
       </Button>
      </div>

      {isLoading && promotions.length === 0 ? (
        <div className="loading">
          <p>Loading promotions...</p>
        </div>
      ) : (
        <PromotionList
          promotions={promotions}
          onEdit={(promotion) => {
            setCurrentPromotion(promotion);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPromotion ? 'Edit Promotion' : 'Create Promotion'}
      >
        <PromotionForm
          initialValues={currentPromotion}
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

export default PromotionsPage;
