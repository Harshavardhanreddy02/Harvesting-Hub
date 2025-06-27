import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SellTools = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    dateListed: "",
    manufacturedDate: "",
    endDate: "",
    image: null,
    imagePreview: null,
    category: "Hand Tools", // Default category
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size should be less than 5MB");
          return;
        }
        // Check file type
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload an image file");
          return;
        }
        setForm({
          ...form,
          image: file,
          imagePreview: URL.createObjectURL(file),
        });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("stockQuantity", form.quantity);
      formData.append("dateListed", form.dateListed);
      formData.append("manufacturedDate", form.manufacturedDate);
      formData.append("endDate", form.endDate);
      formData.append("category", form.category);
      // Ensure we match the Tool model fields
      formData.append("email", currentUser.email);
      formData.append("totalSales", 0);
      formData.append("createdAt", new Date().toISOString());
      formData.append("image", form.image);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tool/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (response.data.success) {
        toast.success("Tool listed successfully!");
        navigate("/Market");
      } else {
        toast.error(response.data.message || "Error listing tool");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error listing tool");
    }
  };

  const categories = [
    "Hand Tools",
    "Power Tools",
    "Garden Tools",
    "Harvesting Equipment",
    "Irrigation Equipment",
    "Safety Equipment",
    "Storage Equipment",
    "Other"
  ];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sell a Tool</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Tool Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter tool name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Price (Rs)</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter price"
            type="number"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Quantity</label>
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter quantity"
            type="number"
            min="1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter description"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Image</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
            required
          />
          {form.imagePreview && (
            <img
              src={form.imagePreview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Date Listed</label>
            <input
              name="dateListed"
              value={form.dateListed}
              onChange={handleChange}
              type="date"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Manufactured Date</label>
            <input
              name="manufacturedDate"
              value={form.manufacturedDate}
              onChange={handleChange}
              type="date"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">End Date (Remove from listing)</label>
          <input
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            type="date"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          List Tool
        </button>
      </form>
    </div>
  );
};

export default SellTools;