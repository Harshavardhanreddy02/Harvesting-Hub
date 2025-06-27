import express from 'express'
import { 
    addProduct, 
    deleteProduct, 
    listProduct,
    searchProduct, 
    fastSellingItems, 
    newlyAddedProducts, 
    farmerList,
    updateProduct,
    farmerDelete,
    farmerRevenue,
    getTopSellingProducts,
    getProductCount,
    getBestSellers,
    repairProductData,
    repairCorruptedProducts,
    getProductCountHandler,
    getProductById
} from '../controllers/product.js'
import multer from 'multer'
import { verifyToken } from '../middleware/auth.js';
import Product from '../models/Product.js';

const productRouter = express.Router()

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

productRouter.post("/add", upload.single("image"), addProduct)
productRouter.get("/list", listProduct)
productRouter.get("/repair-data", repairCorruptedProducts)
productRouter.post("/farmerlist", farmerList)
productRouter.post("/farmerrevenue", farmerRevenue)
productRouter.put("/farmerupdate/:id", updateProduct)
productRouter.delete("/farmerdelete/:id", farmerDelete)
productRouter.get("/topselling", fastSellingItems)
productRouter.get("/recentadded", newlyAddedProducts)
productRouter.get("/search/:search", searchProduct)
productRouter.post("/delete/:id", deleteProduct)
productRouter.get('/top-selling-products', getTopSellingProducts)
productRouter.put('/product/update/:id', updateProduct)
productRouter.put('/update/:id', updateProduct)
productRouter.get("/best-sellers", getBestSellers)
productRouter.get("/count", getProductCountHandler)
productRouter.get('/:id', getProductById)

export default productRouter