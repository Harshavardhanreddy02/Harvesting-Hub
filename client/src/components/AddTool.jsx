import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import upload_area from "./../../assets/upload_area.png";
import Sidebar from "./Sidebar";
// import add_form from "./../../assets/add-form.jpg"
import "./AddTool.css";

export const AddTool = () => {
  const [Image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Seeds",
  });
  const onHandleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((p) => ({ ...p, [name]: value }));
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/tool/add`;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", Image);
    const response = await axios.post(url, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Seeds",
      });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="flex items-start gap-12">
      <Sidebar />
      <div className="mx-auto mt-2">
        <form
          className="flex flex-col mx-10 gap-4 p-4 hello"
          // style={{ backgroundImage: `url(${add_form})` }}
          onSubmit={onSubmitHandler}
        >
          <div className="flex px-4 py-2">
            <div className="back text-black">
              <div className="flex flex-col justify-center items-start mb-2">
                <p>Product Name</p>
                <input
                  onChange={onHandleChange}
                  value={data.name}
                  type="text"
                  name="name"
                  placeholder="Type here"
                  className="p-1 border-2 border-blue-400 input"
                />
              </div>
              <div className="flex-col justify-center items-start flex mb-2 ">
                <p>Product Description</p>
                <textarea
                  className="w-80 p-1 border-2 border-blue-400 inpuut"
                  onChange={onHandleChange}
                  value={data.description}
                  name="description"
                  rows="3"
                  placeholder="Write content here"
                  required
                ></textarea>
              </div>
              <div className="flex flex-col justify-center items-start  ">
                <div className=" mb-2">
                  <p>Product Category</p>
                  <select
                    name="category"
                    onChange={onHandleChange}
                    className="p-1 border-2 border-blue-400 input"
                  >
                    <option value="Bio-fertilizers">Bio-fertilizers</option>
                    <option value="Fungicides">Fungicides</option>
                    <option value="Irrigation">Irrigation</option>
                    <option value="Organic fertilizers">
                      Organic fertilizers
                    </option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="PH balancer">PH balancer</option>
                    <option value="Seeds">Seeds</option>
                  </select>
                </div>
                <div className="flex flex-col mb-2 justify-center items-start  ">
                  <p>Product Price</p>
                  <input
                    onChange={onHandleChange}
                    value={data.price}
                    type="Number"
                    name="price"
                    placeholder="25/-"
                    className="p-1 border-2 border-blue-400 input"
                  />
                </div>
                <div className="flex flex-col justify-center items-start ">
                  <p>Upload Image</p>
                  <label htmlFor="image">
                    <img
                      src={Image ? URL.createObjectURL(Image) : upload_area}
                      className="border-2 border-blue-400 h-24"
                    />
                  </label>
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    name="image"
                    id="image"
                    hidden
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="border-black border-1 p-3 rounded-lg text-white bg-blue-600 hover:opacity-90 max-w-40 ml-28"
          >
            ADD PRODUCT
          </button>
        </form>
      </div>
    </div>
  );
};
