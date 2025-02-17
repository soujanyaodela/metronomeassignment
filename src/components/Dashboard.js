import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft icon

const API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL + "/items"
  : "http://localhost:5000/items";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnwkuwyxp/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "xg6pezgc";

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImage(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !image) {
      alert("All fields are required");
      return;
    }

    try {
      if (editingItem) {
        await axios.put(`${API_URL}/${editingItem.id}`, {
          title,
          description,
          image,
          rating,
        });
      } else {
        await axios.post(API_URL, { title, description, image, rating });
      }

      setTitle("");
      setDescription("");
      setImage("");
      setRating(1);
      setEditingItem(null);
      setIsFormExpanded(false);
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setImage(item.image);
    setRating(item.rating);
    setEditingItem(item);
    setIsFormExpanded(true);
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;
    try {
      await axios.delete(`${API_URL}/${deleteItemId}`);
      fetchItems();
      setDeleteItemId(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="page-container">
      <section className="create-section">
        <div className="create-header">
          <h2>{editingItem ? "Edit Post" : "Create New Post"}</h2>
          <button 
            className="toggle-form-btn"
            onClick={() => setIsFormExpanded(!isFormExpanded)}
          >
            {isFormExpanded ? "Close Form" : "Create New"}
          </button>
        </div>
        <button onClick={() => navigate('/HomePage')} className="back-button">
  <ArrowLeft className="arrow-icon" />
</button>


        <div className={`create-form ${isFormExpanded ? 'expanded' : ''}`}>
          <div className="form-grid">
            <div className="form-row">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Rating (1-5)"
                value={rating}
                min="1"
                max="5"
                onChange={(e) => setRating(Number(e.target.value))}
                className="input"
              />
            </div>
            
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea"
            />
            
            <input
              type="file"
              onChange={handleImageUpload}
              className="input"
            />
            
            {loading && <p className="loading-text">Uploading image...</p>}
            
            <button onClick={handleSubmit} className="submit-button">
              {editingItem ? "Update Post" : "Create Post"}
            </button>
          </div>
        </div>
      </section>

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
                  onClick={() => handleEdit(item)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteItemId(item.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteItemId && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h3>Are you sure?</h3>
            <p>This action cannot be undone.</p>
            <div className="popup-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>Confirm</button>
              <button className="cancel-btn" onClick={() => setDeleteItemId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
