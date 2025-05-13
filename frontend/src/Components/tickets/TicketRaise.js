import { useNavigate } from 'react-router-dom';
import TicketForm from './TicketForm';
import UserNav from '../UserNav/UserNav';
import './TicketRaise.css';

const TicketRaise = () => {
    const navigate = useNavigate();

    const handleSubmitSuccess = () => {
        navigate('/ticket-status');
    };

    return (
        <div>
            <UserNav />
            <div className="ticket-raise-container">
                <TicketForm onSubmitSuccess={handleSubmitSuccess} />
            </div>
        </div>
    );
};

export default TicketRaise;
