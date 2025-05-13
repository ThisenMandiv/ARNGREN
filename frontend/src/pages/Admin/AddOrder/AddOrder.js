import axios from "axios"; // ✅ Import axios properly
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddOrder.css"; // ✅ Your existing CSS

function AddOrder() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        userName: "",
        product: "",
        quantity: "",
        deliveryAddress: "",
        date: ""
    });

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        await sendRequest();
        history("/orderdetails"); // Navigate after request completes
    };

    const sendRequest = async () => {
        try {
            const res = await axios.post("http://localhost:5000/orders", {
                userName: String(inputs.userName),
                product: String(inputs.product),
                quantity: Number(inputs.quantity),
                deliveryAddress: String(inputs.deliveryAddress),
                date: String(inputs.date),
                status: "Pending" // 🚀 New orders are "Pending"
            });
            return res.data;
        } catch (error) {
            console.error("Error adding order:", error);
        }
    };

    return (
        <div>
            <h1>Add Order</h1>
            <form onSubmit={handleSubmit}>
                <label>User Name</label>
                <br />
                <input type="text" name="userName" onChange={handleChange} value={inputs.userName} required />
                <br /><br />

                <label>Product</label>
                <br />
                <input type="text" name="product" onChange={handleChange} value={inputs.product} required />
                <br /><br />

                <label>Quantity</label>
                <br />
                <input type="number" name="quantity" onChange={handleChange} value={inputs.quantity} required />
                <br /><br />

                <label>Delivery Address</label>
                <br />
                <input type="text" name="deliveryAddress" onChange={handleChange} value={inputs.deliveryAddress} required />
                <br /><br />

                <label>Date</label>
                <br />
                <input type="date" name="date" onChange={handleChange} value={inputs.date} required />
                <br /><br />

                <button type="submit">Submit Order</button>
            </form>
        </div>
    );
}

export default AddOrder;
