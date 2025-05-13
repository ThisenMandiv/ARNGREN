// src/components/Chatbot/Chatbot.js

// --- Keep existing imports, state, useEffects, fetchProductData, toggleChat, handleInputChange ---
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import './Chatbot.css';

const API_BASE_URL = "http://localhost:5000";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const [productsData, setProductsData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const fetchProductData = useCallback(async () => {
        // ... (fetch logic remains the same) ...
        if (productsData || isFetching) return;
        setIsFetching(true); setFetchError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/products`);
            setProductsData(response.data.products || []);
        } catch (err) {
            setFetchError("Sorry, I couldn't retrieve product information right now.");
            setProductsData([]);
        } finally {
            setIsFetching(false);
        }
    }, [productsData, isFetching]);

    useEffect(() => {
        if (isOpen) {
            if (messages.length === 0) {
                setMessages([{ sender: 'bot', text: 'Hello! How can I help you today? Ask about specific products, stock count, contact info, or events.' }]);
            }
            fetchProductData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, fetchProductData]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);
    const handleInputChange = (e) => setInputValue(e.target.value);
    // --- End existing setup ---


    // --- Enhanced Response Logic ---
    const getBotResponse = (userInput) => {
        const lowerCaseInput = userInput.toLowerCase().trim();

        // --- Pre-checks for data status ---
        if (fetchError && (lowerCaseInput.includes('stock') || lowerCaseInput.includes('product'))) {
            return fetchError;
        }
        if (isFetching && (lowerCaseInput.includes('stock') || lowerCaseInput.includes('product'))) {
            return "I'm currently fetching the latest product information, please wait a moment...";
        }
        // --- End Pre-checks ---


        // --- Specific Product Stock Check ---
        // Try to identify if the user is asking about a specific item's stock
        const stockKeywords = ['stock of', 'how many', 'do you have', 'available', 'count of', 'in stock'];
        let potentialProductName = '';
        let isAskingSpecificStock = false;

        for (const keyword of stockKeywords) {
            if (lowerCaseInput.includes(keyword)) {
                 isAskingSpecificStock = true;
                 // Basic attempt to extract product name: remove keyword and common words
                 potentialProductName = lowerCaseInput
                     .replace(keyword, '')
                     .replace(/ a /g, ' ')
                     .replace(/ an /g, ' ')
                     .replace(/ any /g, ' ')
                     .replace(/ in /g, ' ')
                     .replace(/ is /g, ' ')
                     .replace(/ are /g, ' ')
                     .replace(/ there /g, ' ')
                     .replace(/ available/g, '')
                     .replace(/ stock/g, '')
                     .replace(/\?/g, '') // Remove question marks
                     .trim();
                 break; // Found a keyword, stop checking
            }
        }

        if (isAskingSpecificStock && potentialProductName) {
             console.log("Chatbot: Detected specific stock query for:", potentialProductName);
             if (!productsData) {
                 fetchProductData(); // Attempt fetch if data not ready
                 return "Let me check the stock for that specific item...";
             } else {
                 // Search for the product (case-insensitive)
                 const foundProduct = productsData.find(p =>
                     p.name.toLowerCase().includes(potentialProductName)
                 );

                 if (foundProduct) {
                     if (foundProduct.quantity > 0) {
                         return `Yes, we have ${foundProduct.quantity} of "${foundProduct.name}" in stock.`;
                     } else {
                         return `Sorry, "${foundProduct.name}" is currently out of stock.`;
                     }
                 } else {
                     // Check if maybe they mentioned a category instead
                     const foundCategory = productsData.filter(p =>
                        p.category.toLowerCase().includes(potentialProductName)
                     );
                     if (foundCategory.length > 0) {
                         const availableInCategory = foundCategory.filter(p => p.quantity > 0).length;
                         return `We have ${foundCategory.length} items in the "${foundCategory[0].category}" category, with ${availableInCategory} currently in stock. You can browse them on the Shop page.`;
                     } else {
                         return `Sorry, I couldn't find a product matching "${potentialProductName}". Please check the spelling or browse our Shop page.`;
                     }
                 }
             }
        }
        // --- End Specific Product Stock Check ---


        // --- General Stock Count ---
        // Check this *after* specific stock check
        if (lowerCaseInput.includes('stock') || lowerCaseInput.includes('count') || lowerCaseInput.includes('how many products')) {
             if (productsData) {
                 const count = productsData.length;
                 const availableCount = productsData.filter(p => p.quantity > 0).length;
                 return `We currently have ${count} different product types listed, with ${availableCount} currently in stock. You can browse them on the Shop page.`;
             } else {
                 fetchProductData();
                 return "Let me check the latest product information for you...";
             }
        }

        // --- Other Keyword Responses (keep existing) ---
        if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) return 'Hello there! How can I assist you?';
        if (lowerCaseInput.includes('product') || lowerCaseInput.includes('item') || lowerCaseInput.includes('shop')) return 'You can browse our products on the Shop page. I can also tell you the stock count for specific items.';
        if (lowerCaseInput.includes('contact') || lowerCaseInput.includes('phone') || lowerCaseInput.includes('email')) return 'Contact details are on the Contact Us page. Phone: +94 11 234 5678, Email: info@jewelshop.lk.';
        if (lowerCaseInput.includes('event')) return 'Check out our Events page for upcoming showcases!';
        if (lowerCaseInput.includes('order')) return 'For order status, please log in or contact us directly.';
        if (lowerCaseInput.includes('help')) return 'I can help with basic questions about products (like stock count), events, or contact info.';
        if (lowerCaseInput.includes('thank')) return 'You\'re welcome!';

        // --- Default Response ---
        return "Sorry, I didn't quite understand that. You can ask about specific products (e.g., 'stock of rings'), events, or contact information.";
    };
    // --- End Enhanced Response Logic ---


    // handleSendMessage logic (keep existing)
    const handleSendMessage = (e) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage) return;
        const newUserMessage = { sender: 'user', text: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        const lowerCaseInput = userMessage.toLowerCase();
         if ((lowerCaseInput.includes('stock') || lowerCaseInput.includes('count') || lowerCaseInput.includes('product')) && !productsData && !isFetching) {
             fetchProductData();
         }
        setTimeout(() => {
            const botResponseText = getBotResponse(userMessage);
            const newBotMessage = { sender: 'bot', text: botResponseText };
            setTimeout(() => {
                setMessages(prev => [...prev, newBotMessage]);
            }, 300 + Math.random() * 400);
        }, 100);
    };


    // --- JSX (keep existing structure with floating button) ---
    return (
        <div className="chatbot-container">
            <button
                className={`chatbot-toggle-button ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
            >
                {isOpen ? <FiX /> : <FiMessageSquare />}
            </button>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>JewelShop Assistant</h3>
                        <button onClick={toggleChat} aria-label="Close Chat"><FiX /></button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isFetching && <div className="message bot typing"><span></span><span></span><span></span></div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chatbot-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Ask about stock, events..."
                            aria-label="Chat input"
                            disabled={isFetching}
                        />
                        <button type="submit" aria-label="Send Message" disabled={isFetching}><FiSend /></button>
                    </form>
                </div>
            )}
        </div>
    );
    // --- End JSX ---
}

export default Chatbot;

