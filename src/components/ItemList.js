import React from 'react';

const ItemList = ({ items, onEdit, onDelete }) => {
  return (
    <div className="items-grid">
      {items.map((item) => (
        <div key={item.id} className="item-card">
          <img src={item.image} alt={item.title} className="item-image" />
          <div className="item-content">
            <h4 className="item-title">{item.title}</h4>
            <p className="item-description">{item.description}</p>
            <p className="item-rating">{"⭐".repeat(item.rating)}</p>
            <div className="button-group">
              <button
                onClick={() => onEdit(item)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;