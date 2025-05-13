import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './UpdateDiscountForm.css';

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

const UpdateDiscountForm = ({ initialValues, onUpdateSuccess }) => {
  const today = new Date().toISOString().split('T')[0];

  const formik = useFormik({
    initialValues: initialValues || {
      code: '',
      percentage: '',
      validUntil: '',
    },
    validationSchema: discountSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!initialValues || !initialValues._id) {
          alert('Discount data not found. Please go back and try again.');
          setSubmitting(false);
          return;
        }
        const res = await axios.put(`http://localhost:5000/api/discounts/${initialValues._id}`, values);
        if (res.status === 200) {
          alert('Discount updated successfully!');
          resetForm();
          onUpdateSuccess?.();
        } else {
          alert('Something went wrong. Please try again.');
        }
      } catch (err) {
        console.error('Update error:', err);
        alert('Error updating discount. Try again later.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Defensive check for missing discount data (AFTER the hook)
  if (!initialValues || !initialValues._id) {
    return <div style={{ color: 'red', padding: '2rem' }}>Error: Discount data not found. Please go back and try again.</div>;
  }

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h1 className="form-title">Update Discount Code</h1>

        <form onSubmit={formik.handleSubmit} className="form-fields">
          <div className="form-group">
            <label htmlFor="code">Discount Code</label>
            <input
              id="code"
              name="code"
              type="text"
              placeholder="SUMMER2023"
              autoFocus
              value={formik.values.code}
              onChange={(e) => formik.setFieldValue('code', e.target.value.toUpperCase())}
              onBlur={formik.handleBlur}
              className={formik.touched.code && formik.errors.code ? 'input error' : 'input'}
            />
            {formik.touched.code && formik.errors.code && (
              <p className="error-text">{formik.errors.code}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="percentage">Discount Percentage</label>
            <div className="input-with-symbol">
              <input
                id="percentage"
                name="percentage"
                type="number"
                min="1"
                max="100"
                placeholder="25"
                value={formik.values.percentage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.percentage && formik.errors.percentage ? 'input error' : 'input'}
              />
              <span className="symbol">%</span>
            </div>
            {formik.touched.percentage && formik.errors.percentage && (
              <p className="error-text">{formik.errors.percentage}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="validUntil">Valid Until</label>
            <input
              id="validUntil"
              name="validUntil"
              type="date"
              min={today}
              value={formik.values.validUntil}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.validUntil && formik.errors.validUntil ? 'input error' : 'input'}
            />
            {formik.touched.validUntil && formik.errors.validUntil && (
              <p className="error-text">{formik.errors.validUntil}</p>
            )}
          </div>

          <div className="form-group">
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="submit-button"
            >
              {formik.isSubmitting ? 'Updating...' : 'Update Discount'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDiscountForm;
