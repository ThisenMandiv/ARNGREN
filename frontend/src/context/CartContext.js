import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  getTotalAmount: () => 0,
  updateQuantity: () => {},
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i._id === item._id);
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (_id) => {
    setItems(prevItems => prevItems.filter(item => item._id !== _id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const updateQuantity = (_id, newQuantity) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item._id === _id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const contextValue = {
    items,
    addItem,
    removeItem,
    clearCart,
    getTotalAmount,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
