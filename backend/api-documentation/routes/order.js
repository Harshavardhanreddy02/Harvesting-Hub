/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management operations
 */

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - items
 *               - totalAmount
 *             properties:
 *               userid:
 *                 type: string
 *                 description: ID of the user placing the order
 *                 example: "60d21b4667d0d8992e610c85"
 *               items:
 *                 type: array
 *                 description: Array of items in the order
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product or tool
 *                       example: "60d21b4667d0d8992e610c87"
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the item
 *                       example: 2
 *               totalAmount:
 *                 type: number
 *                 description: Total amount of the order
 *                 example: 59.98
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "Anytown"
 *                   state:
 *                     type: string
 *                     example: "CA"
 *                   postalCode:
 *                     type: string
 *                     example: "12345"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *               paymentMethod:
 *                 type: string
 *                 example: "credit_card"
 *     responses:
 *       201:
 *         description: Order placed successfully
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
 *                   example: "Order placed successfully"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order data
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
 *                   example: "Invalid order data"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/order/list:
 *   get:
 *     summary: Get all orders with metrics
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders with metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 allOrders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 allMetrics:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: number
 *                       example: 120
 *                     revenueCollected:
 *                       type: number
 *                       example: 5240.75
 *                     itemsSold:
 *                       type: number
 *                       example: 350
 *                 metrics:
 *                   type: object
 *                   properties:
 *                     last30Min:
 *                       type: object
 *                       properties:
 *                         totalOrders:
 *                           type: number
 *                           example: 5
 *                         revenueCollected:
 *                           type: number
 *                           example: 245.50
 *                         itemsSold:
 *                           type: number
 *                           example: 15
 *                     last2Hours:
 *                       type: object
 *                       properties:
 *                         totalOrders:
 *                           type: number
 *                           example: 12
 *                         revenueCollected:
 *                           type: number
 *                           example: 540.25
 *                         itemsSold:
 *                           type: number
 *                           example: 35
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/order/userorders:
 *   post:
 *     summary: Get orders for a specific user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *             properties:
 *               userid:
 *                 type: string
 *                 description: ID of the user
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: User's orders with time-based metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: number
 *                       example: 15
 *                     countLast60Min:
 *                       type: number
 *                       example: 2
 *                     countLast2Days:
 *                       type: number
 *                       example: 5
 *                     countLast1Week:
 *                       type: number
 *                       example: 8
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *       400:
 *         description: User ID is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/order/verify:
 *   post:
 *     summary: Verify order payment
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - success
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c90"
 *               success:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 example: "true"
 *     responses:
 *       200:
 *         description: Payment verified
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
 *                   example: "Paid"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/order/status:
 *   post:
 *     summary: Update order status
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - status
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c90"
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, completed, cancelled]
 *                 example: "delivered"
 *     responses:
 *       200:
 *         description: Status updated
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
 *                   example: "Status Updated"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/order/user-stats:
 *   get:
 *     summary: Get order statistics for current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User order statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: number
 *                   example: 25
 *                 pendingOrders:
 *                   type: number
 *                   example: 3
 *                 completedOrders:
 *                   type: number
 *                   example: 20
 *                 cancelledOrders:
 *                   type: number
 *                   example: 2
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/order/count:
 *   get:
 *     summary: Get total order count (admin dashboard)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total order count
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
 *                   example: 150
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/order/revenue:
 *   get:
 *     summary: Get total revenue from completed orders (admin dashboard)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: number
 *                   example: 15780.50
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/order/stats:
 *   get:
 *     summary: Get order statistics (admin dashboard)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Order statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: number
 *                   example: 150
 *                 pending:
 *                   type: number
 *                   example: 25
 *                 completed:
 *                   type: number
 *                   example: 120
 *                 cancelled:
 *                   type: number
 *                   example: 5
 *       500:
 *         description: Server error
 */
