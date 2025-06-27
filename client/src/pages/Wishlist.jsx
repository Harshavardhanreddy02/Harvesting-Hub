import { useContext, useEffect, useState } from "react";
import { storeContext } from "../pages/redux/context/storeContext";
import FoodItem from "../components/FoodItem";
import { useSelector } from "react-redux";
import "./Wishlist.css";

const Wishlist = () => {
  const { wishlist, food_list, tool_list, token, fetchWishlist } = useContext(storeContext);
  const { currentUser } = useSelector((state) => state.user);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Get the appropriate list based on user role
    const relevantList = currentUser?.role === 'Farmer' ? tool_list : food_list;
    
    // Filter items that are in the wishlist
    const items = relevantList.filter(item => wishlist && wishlist.includes(item._id));

    console.log("User role:", currentUser?.role);
    console.log("Wishlist items:", wishlist);
    console.log("Relevant list length:", relevantList.length);
    console.log("Filtered items length:", items.length);
    
    setWishlistItems(items);
    setLoading(false);
  }, [wishlist, food_list, tool_list, token, currentUser?.role]);

  if (loading) {
    return <div className="wishlist-loading">Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty.</p>
          <p>Click the heart icon on {currentUser?.role === 'Farmer' ? 'tools' : 'products'} to add them to your wishlist.</p>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map(item => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
              stock={item.stockQuantity}
              seller_name={item.seller_name || "Unknown Seller"}
              dateListed={item.createdAt}
              manufacturedDate={item.createdAt}
              endDate=""
              category={item.category}
              location=""
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;