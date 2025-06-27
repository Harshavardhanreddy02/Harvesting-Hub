/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management operations
 */

/**
 * @swagger
 * /api/product/add:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Organic Tomatoes"
 *               price:
 *                 type: number
 *                 example: 2.99
 *               description:
 *                 type: string
 *                 example: "Fresh organic tomatoes from local farms"
 *               category:
 *                 type: string
 *                 example: "Vegetables"
 *               stockQuantity:
 *                 type: number
 *                 example: 100
 *               image:
 *                 type: string
 *                 format: binary
 *               email:
 *                 type: string
 *                 example: "farmer@example.com"
 *               seller:
 *                 type: string
 *                 example: "John's Farm"
 *               dateListed:
 *                 type: string
 *                 format: date
 *                 example: "2023-05-15"
 *               manufacturedDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-05-10"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-15"
 *               status:
 *                 type: string
 *                 enum: [On Sale, Sold Out, Expired]
 *                 example: "On Sale"
 *               discount:
 *                 type: number
 *                 example: 0
 *     responses:
 *       200:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product added successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Image is required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error adding product"
 */

/**
 * @swagger
 * /api/product/list:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c87"
 *                       name:
 *                         type: string
 *                         example: "Organic Tomatoes"
 *                       description:
 *                         type: string
 *                         example: "Fresh organic tomatoes from local farms"
 *                       price:
 *                         type: number
 *                         example: 2.99
 *                       category:
 *                         type: string
 *                         example: "Vegetables"
 *                       image:
 *                         type: string
 *                         example: "tomatoes.jpg"
 *                       stockQuantity:
 *                         type: number
 *                         example: 100
 *                       email:
 *                         type: string
 *                         example: "farmer@example.com"
 *                       seller:
 *                         type: string
 *                         example: "John's Farm"
 *                       status:
 *                         type: string
 *                         example: "On Sale"
 *                       discount:
 *                         type: number
 *                         example: 0
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/farmerlist:
 *   post:
 *     summary: Get products by farmer's email
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "farmer@example.com"
 *     responses:
 *       200:
 *         description: List of farmer's products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Products retrieved successfully."
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Email is required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/farmerrevenue:
 *   post:
 *     summary: Get farmer's revenue and sold products
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "farmer@example.com"
 *               timePeriod:
 *                 type: string
 *                 enum: [30min, 2hrs, 1day, 1week, all]
 *                 example: "1week"
 *     responses:
 *       200:
 *         description: Farmer's revenue and sold products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 soldProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                       price:
 *                         type: number
 *                       quantity:
 *                         type: number
 *                       image:
 *                         type: string
 *                 revenue:
 *                   type: number
 *                   example: 1250.75
 *                 totalItemsSold:
 *                   type: number
 *                   example: 45
 *       400:
 *         description: Email is required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/farmerupdate/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               stockQuantity:
 *                 type: number
 *               status:
 *                 type: string
 *               discount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/farmerdelete/{id}:
 *   delete:
 *     summary: Delete a product (for farmers)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/topselling:
 *   get:
 *     summary: Get fast selling products (low stock)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Fast selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/recentadded:
 *   get:
 *     summary: Get recently added products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Recently added products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/search/{search}:
 *   get:
 *     summary: Search for products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/delete/{id}:
 *   post:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/top-selling-products:
 *   get:
 *     summary: Get top selling products based on orders
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Top selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       stock:
 *                         type: number
 *                       totalOrders:
 *                         type: number
 *                       totalAmount:
 *                         type: number
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/update/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               stockQuantity:
 *                 type: number
 *               status:
 *                 type: string
 *               discount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/best-sellers:
 *   get:
 *     summary: Get best selling products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Best selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Organic Tomatoes"
 *                   sales:
 *                     type: number
 *                     example: 120
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/count:
 *   get:
 *     summary: Get total product count
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Total product count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 250
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/repair-data:
 *   get:
 *     summary: Repair corrupted product data
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products repaired successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Fixed 5 products"
 *       400:
 *         description: Repair function not available
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
