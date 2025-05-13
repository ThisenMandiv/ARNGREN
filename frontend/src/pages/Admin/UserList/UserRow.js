// src/pages/Admin/UserList/UserRow.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

function UserRow({ user, onDelete }) {

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-LK', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        } catch (e) { return 'Invalid Date'; }
    };

    return (
        <tr>
            <td>{user.name} {user.superAdmin && <span style={{color:'#ffd700',fontWeight:'bold',marginLeft:4}} title="Super Admin">★ Super Admin</span>}</td>
            <td>{user.email}</td>
            <td>{user.age}</td>
            <td>
                 <span className={`role-label role-${user.role?.toLowerCase()}`}>
                    {user.role || 'N/A'}
                 </span>
            </td>
            <td>{formatDate(user.createdAt)}</td>
            <td className="action-cell">
                {/* Link to the admin update page */}
                <Link to={`/admin/users/update/${user._id}`} className="action-icon edit-icon" title="Edit User">
                    <FiEdit />
                </Link>
                <button
                    onClick={() => onDelete(user._id, user.name)}
                    className="action-icon delete-icon"
                    title="Delete User"
                >
                    <FiTrash2 />
                </button>
            </td>
        </tr>
    );
}

export default UserRow;
