// ...existing code...

// Fast Selling Products section
<div className="fast-selling-products my-10">
  <h2 className="text-2xl font-bold text-center mb-6">Fast Selling Products</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
    {fastSelling.map((product, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-48 overflow-hidden">
          <img 
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='12' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2">{product.description || "No description available"}</p>
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-bold">₹{product.price}</span>
            <button 
              onClick={() => handleFastSellingClick(product._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-300"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Recently Added Products section */}
<div className="recently-added-products my-10">
  <h2 className="text-2xl font-bold text-center mb-6">Recently Added Products</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
    {recentlyAdded.map((product, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-48 overflow-hidden">
          <img 
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='12' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2">{product.description || "No description available"}</p>
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-bold">₹{product.price}</span>
            <button 
              onClick={() => handleRecentlyAddedClick(product._id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-300"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

// ...existing code...