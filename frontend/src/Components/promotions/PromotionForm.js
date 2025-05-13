import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './PromotionForm.css';

const PromotionForm = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      description: '',
      percentage: '',
      startDate: '',
      endDate: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      percentage: Yup.number()
        .required('Percentage is required')
        .min(1, 'Percentage must be at least 1')
        .max(100, 'Percentage cannot exceed 100'),
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date')
    }),
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="promotion-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          className={formik.touched.title && formik.errors.title ? 'error' : ''}
        />
        {formik.touched.title && formik.errors.title && (
          <div className="error-message">{formik.errors.title}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className={formik.touched.description && formik.errors.description ? 'error' : ''}
        />
        {formik.touched.description && formik.errors.description && (
          <div className="error-message">{formik.errors.description}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="percentage">Discount Percentage</label>
        <input
          id="percentage"
          name="percentage"
          type="number"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.percentage}
          className={formik.touched.percentage && formik.errors.percentage ? 'error' : ''}
        />
        {formik.touched.percentage && formik.errors.percentage && (
          <div className="error-message">{formik.errors.percentage}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.startDate}
          className={formik.touched.startDate && formik.errors.startDate ? 'error' : ''}
        />
        {formik.touched.startDate && formik.errors.startDate && (
          <div className="error-message">{formik.errors.startDate}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="endDate">End Date</label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.endDate}
          className={formik.touched.endDate && formik.errors.endDate ? 'error' : ''}
        />
        {formik.touched.endDate && formik.errors.endDate && (
          <div className="error-message">{formik.errors.endDate}</div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {initialValues ? 'Update Promotion' : 'Create Promotion'}
        </button>
      </div>
    </form>
  );
};

export default PromotionForm;
