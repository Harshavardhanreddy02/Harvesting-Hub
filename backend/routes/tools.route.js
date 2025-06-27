import express from 'express'
import { addtool, deletetool, listtool, searchTool, fastSellingItems, newlyAddedProducts , updateTool } from '../controllers/tools.js'
import multer from 'multer'
import { verifyToken } from '../middleware/auth.js'
import Tool from '../models/Tool.js'

const toolRouter = express.Router()

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

toolRouter.post("/add",upload.single("image"),addtool)
toolRouter.post("/delete/:id",deletetool)
toolRouter.get("/topselling",fastSellingItems)
toolRouter.get("/recentadded",newlyAddedProducts)
toolRouter.get("/list",listtool)
toolRouter.get("/search/:search",searchTool)
toolRouter.put('/update/:id', updateTool);

// Add count endpoint for admin dashboard
toolRouter.get('/count', async (req, res) => {
  try {
    const count = await Tool.countDocuments();
    console.log('Tool count:', count);
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error counting tools:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get top selling tools with better error handling
toolRouter.get('/topselling', async (req, res) => {
  try {
    const tools = await Tool.find({ stockQuantity: { $gt: 0 } })
      .sort({ stockQuantity: 1 })
      .limit(5);
    
    console.log('Top selling tools fetched:', tools.length);
    res.json({ success: true, message: tools });
  } catch (error) {
    console.error('Error fetching top selling tools:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recently added tools
toolRouter.get('/recentadded', async (req, res) => {
  try {
    const tools = await Tool.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recently added tools' });
  }
});

// Get all tools
toolRouter.get('/', async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tools' });
  }
});

// Get tool by ID
toolRouter.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tool' });
  }
});

// Create new tool
toolRouter.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const tool = new Tool({
      ...req.body,
      image: req.file ? req.file.filename : null,
      farmerId: req.user.id
    });
    await tool.save();
    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tool' });
  }
});

// Update tool
toolRouter.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    if (tool.farmerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updatedTool = await Tool.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: req.file ? req.file.filename : tool.image
      },
      { new: true }
    );
    res.json(updatedTool);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tool' });
  }
});

// Delete tool
toolRouter.delete('/:id', verifyToken, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    if (tool.farmerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Tool.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tool' });
  }
});

export default toolRouter


// # Test Helmet Security Headers
// curl http://localhost:3000/api/test/security-headers

// # Test Body Parser
// curl -X POST http://localhost:3000/api/test/body-parser \
//   -H "Content-Type: application/json" \
//   -d '{"test":"data", "number": 123}'

// # Test Cookie Parser
// curl http://localhost:3000/api/test/cookie-test

// # Test Session
// curl http://localhost:3000/api/test/session-test

// # Test Logger
// curl http://localhost:3000/api/test/logger-test

// # Test Error Handler
// curl http://localhost:3000/api/test/error-test