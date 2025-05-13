// AdminTicketForm.js
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../ui/Input";
import Button from "../ui/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./AdminTicketForm.css";

const adminTicketSchema = Yup.object().shape({
  status: Yup.string()
    .required("Status is required")
    .oneOf(["Open", "InProgress", "Resolved"], "Invalid status"),
  comments: Yup.string().max(500, "Comment cannot exceed 500 characters"),
});

const AdminTicketForm = ({ ticket, onUpdateSuccess }) => {
  const formik = useFormik({
    initialValues: {
      status: ticket?.status || "Open",
      comments: "",
    },
    validationSchema: adminTicketSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/tickets/${ticket._id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Ticket updated successfully!");
          if (onUpdateSuccess) onUpdateSuccess();
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error updating ticket:", error);
        toast.error("Error updating ticket. Please try again later.");
      }
    },
  });

  return (
    <div className="admin-ticket-form-container">
      <h2 className="form-title">Update Ticket</h2>
      <form onSubmit={formik.handleSubmit} className="form-body">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-select"
          >
            <option value="Open">Open</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <p className="form-error">{formik.errors.status}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Add Comment</label>
          <Input
            name="comments"
            type="textarea"
            formik={formik}
            rows="4"
            placeholder="Add a comment..."
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            loading={formik.isSubmitting}
            disabled={!formik.isValid || formik.isSubmitting}
            className="form-button"
          >
            Update Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminTicketForm;