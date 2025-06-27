import fs from "fs";
import Tool from "../models/Tool.js";

const addtool = async(req,res)=>{

    let image_filename = `${req.file.filename}`

    const tool = new Tool({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
        category : req.body.category,
        image : image_filename,
        email: req.body.email
    })

    try{
        await tool.save()
        res.json({success:true,message:"tool added successfully"})
    }catch(err){
        res.json({success:false,message:`${err.message}`})
    }

}

const listtool = async (req, res) => {
    try {
        const tools = await Tool.find({}).lean();

        if (!tools || tools.length === 0) {
            return res.json({ success: false, message: "No tools found" });
        }

        // Relax validation: Provide default values for missing fields
        const safeTools = tools.map(tool => ({
            _id: tool._id || null,
            name: tool.name || "Unnamed Tool",
            description: tool.description || "No description available",
            price: tool.price || 0,
            category: tool.category || "Uncategorized",
            image: tool.image || "default.jpg",
            stockQuantity: tool.stockQuantity || 0,
            ...tool // Include any additional fields
        }));

        res.json({ success: true, message: safeTools });
    } catch (err) {
        console.error("Error fetching tool list:", err);
        res.status(500).json({ success: false, message: `Error fetching tools: ${err.message}` });
    }
}

const farmerListTool = async (req, res) => {
    const { email } = req.body;

    // Validate email parameter
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    try {
        // Find products by farmer's email
        const tools = await Tool.find({ email });

        if (tools.length === 0) {
            return res.json({ success: true, message: "No tools found for this farmer.", tools: [] });
        }

        // Return found products
        res.json({ success: true, message: "Tools retrieved successfully.",tools });
    } catch (error) {
        res.status(500).json({ success: false, message: `Error fetching products: ${error.message}` });
    }
}

const farmerDeleteTool = async (req, res) => {
    const { id } = req.params;
  
    try {
      const tool = await Tool.findByIdAndDelete(id);
  
      if (!tool) {
        return res.status(404).json({ success: false, message: "Tool not found" });
      }
  
      res.status(200).json({ success: true, message: "Tool deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error deleting product", error: err.message });
    }
  };

const updateTool = async (req, res) => {
  const { id } = req.params;
  // Allow updating of all possible fields sent in the request body
  const updateData = req.body;

  try {
    // Find the tool by ID and update with all provided fields
    const updatedTool = await Tool.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTool) {
      return res.status(404).json({ success: false, message: "Tool not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Tool updated successfully", 
      tool: updatedTool 
    });
  } catch (err) {
    console.error("Error updating tool:", err);
    res.status(500).json({ success: false, message: "Error updating tool", error: err.message });
  }
};

const searchTool = async(req,res)=>{
    const {search} = req.params
    try{
        if(search==""){
            const tools = await Tool.find({})
            return res.json({success:true,message:tools})
        }
        const tools = await Tool.find({name:{$regex:search,$options:"i"}})
        res.json({success:true,message:tools})
    }catch(err){
        res.json({success:false,message:`${err.message}`})
    }
}

const deletetool=async(req,res)=>{
    try{
        const tool = await Tool.findById(req.params.id)
        fs.unlink(`uploads/${tool.image}`,()=>{})
        await Tool.findByIdAndDelete(req.params.id)
        res.json({success:true,message:"tool deleted successfully"})
    }catch(err){
        res.json({success:false,message:`${err.message}`})
    }
}

const fastSellingItems = async (req, res) => {
    try {
      // Fetch products with stock > 0, sorted by stock quantity in ascending order (least stock first)
      const products = await Tool.find({ stockQuantity: { $gt: 0 } })
        .sort({ stockQuantity: 1 })
        .limit(10); // Limit to top 5 products
  
      res.json({ success: true, message: products });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
};

const newlyAddedProducts = async (req, res) => {
    try {
      // Fetch the top 5 most recently added products (sorted by creation date descending)
      const products = await Tool.find()
        .sort({ updatedAt: -1 }) // Sort by createdAt in descending order (newest first)
        .limit(10); // Limit to top 5 most recent products
  
      res.json({ success: true, message: products });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
};

export {addtool,listtool,deletetool,searchTool,fastSellingItems,newlyAddedProducts, updateTool}