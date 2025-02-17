import { useState, useEffect } from "react";
import axios from "axios";
import { auth,db } from "./firebase"; // Import Firebase auth instance
import "./Homepage.css";
import { doc, getDoc } from "firebase/firestore";
import PosterMakerLanding from "./PosterMakerLanding";

const API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL + "/items"
  : "https://backend-vcd4.onrender.com/items";

const Homepage = () => {
  const [userName, setUserName] = useState("");
  const [items, setItems] = useState([]);
 
  

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };

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

  
  useEffect(() => {
    const fetchUser = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          await user.reload(); // ✅ Ensures the latest profile is fetched
          console.log("Auth User:", user);
          console.log("Auth Display Name:", user.displayName);

          setUserName(user.displayName || "User");

          // ✅ Fetch name from Firestore if missing in Authentication
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists() && !user.displayName) {
            setUserName(userDoc.data().fullName);
          }
        }
      });
    };

    fetchUser();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }




  return (
    <div className="page-container">
      

      <section className="create-section">
        <div className="create-header">
          <h2>{`${getGreeting()}, ${userName}`}</h2>
          <button 
            className="toggle-form-btn"
            onClick={handleLogout}
          >
           Logout
          </button>
        </div>

      
      </section>
      <PosterMakerLanding/>
      

      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.image} alt={item.title} className="item-image" />
            <div className="item-content">
              <h4 className="item-title">{item.title}</h4>
              <p className="item-description">{item.description}</p>
              <p className="item-rating">{"⭐".repeat(item.rating)}</p>
              <p className="item-description">Created by {userName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
