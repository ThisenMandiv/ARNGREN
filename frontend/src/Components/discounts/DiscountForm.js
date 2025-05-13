import React from 'react'; // Assuming React is globally available or you set up your non-Vite/non-Tailwind build for this
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../ui/Input'; // Assuming this component is styled appropriately
import Button from '../ui/Button'; // Assuming this component is styled appropriately
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './DiscountForm.css'; // Import the CSS file

// Relaxed Validation Schema
const discountSchema = Yup.object().shape({
  code: Yup.string()
    .required('Discount code is required')
    .matches(/^[A-Za-z0-9]+$/, 'Only letters and numbers allowed')
    .min(3, 'Discount code must be at least 3 characters')
    .max(20, 'Discount code cannot exceed 20 characters'),
  percentage: Yup.number()
    .required('Discount percentage is required')
    .typeError('Must be a valid number')
    .integer('Must be a whole number')
    .min(1, 'Minimum discount is 1%')
    .max(100, 'Maximum discount is 100%'),
  validUntil: Yup.date()
    .required('Expiry date is required')
    .min(new Date(new Date().setHours(0,0,0,0)), 'Date must be today or in the future'),
});

const DiscountForm = ({ initialValues, onSubmit, isSubmitting, onUpdateSuccess }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  // Formik Configuration (logic remains the same)
  const formik = useFormik({
    initialValues: initialValues || {
      code: '',
      percentage: '',
      validUntil: ''
    },
    validationSchema: discountSchema,
    enableReinitialize: true, // Important if initialValues can change
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      try {
        let response;
        if (initialValues && initialValues._id) {
          response = await axios.put(`http://localhost:5000/api/discounts/${initialValues._id}`, values);
        } else {
          response = await axios.post('http://localhost:5000/api/discounts', values);
        }

        if (response.status === 200 || response.status === 201) {
          toast.success(initialValues && initialValues._id ? 'Discount updated successfully!' : 'Discount created successfully!');
          resetForm();
          if (onSubmit) onSubmit(response.data); // Pass data to parent if needed
          if (onUpdateSuccess) onUpdateSuccess(response.data);
          navigate('/admin/discounts'); // Or a relevant page
        } else {
          toast.error(response.data?.message || 'Failed to save discount');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error saving Discount. Please try again later.';
        toast.error(errorMessage);
        // Show backend error on the form
        setFieldError('code', errorMessage);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="discount-form-page-container">
      <div className="discount-form-card">
        <h1 className="discount-form-title">
          {initialValues && initialValues._id ? 'Update Discount' : 'Create Discount Code'}
        </h1>

        <form onSubmit={formik.handleSubmit} className="discount-form">
          {/* Discount Code Input */}
          <div className="form-field-group">
            <label htmlFor="code" className="form-label">Discount Code</label>
            <input
              id="code"
              name="code"
              type="text"
              placeholder="e.g. SUMMER24"
              autoComplete="off"
              autoFocus
              className="input-full-width"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.code && formik.errors.code ? (
              <div className="form-error-text">{formik.errors.code}</div>
            ) : null}
          </div>

          {/* Discount Percentage Input */}
          <div className="form-field-group">
            <label htmlFor="percentage" className="form-label">Discount Percentage</label>
            <input
              id="percentage"
              name="percentage"
              type="number"
              min="1"
              max="100"
              className="input-full-width input-percentage"
              value={formik.values.percentage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.percentage && formik.errors.percentage ? (
              <div className="form-error-text">{formik.errors.percentage}</div>
            ) : null}
          </div>

          {/* Expiry Date Input */}
          <div className="form-field-group">
            <label htmlFor="validUntil" className="form-label">Valid Until</label>
            <input
              id="validUntil"
              name="validUntil"
              type="date"
              min={today}
              className="input-full-width"
              value={formik.values.validUntil}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.validUntil && formik.errors.validUntil ? (
              <div className="form-error-text">{formik.errors.validUntil}</div>
            ) : null}
          </div>

          {/* Submit Button */}
          <div className="form-submit-container">
            <Button
              type="submit"
              loading={formik.isSubmitting || isSubmitting}
              disabled={!formik.isValid || formik.isSubmitting || isSubmitting}
              className="button-full-width button-large"
            >
              {initialValues && initialValues._id ? 'Update Discount' : 'Create Discount'}
            </Button>
          </div>
        </form>
      </div>
      <div style={{marginTop: '1.5rem', color: '#888', fontSize: '0.95em'}}>
        <strong>Sample Data:</strong><br/>
        <div>Code: <code>SUMMER24</code> or <code>save10</code></div>
        <div>Percentage: <code>10</code> or <code>25</code></div>
        <div>Valid Until: <code>{today}</code> or any future date</div>
      </div>
    </div>
  );
};

export default DiscountForm;