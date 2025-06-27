/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - products
 *         - totalAmount
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         user:
 *           type: string
 *           description: User ID who placed the order
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: number
 *                 description: Quantity ordered
 *               price:
 *                 type: number
 *                 description: Price at time of order
 *           description: Products in the order
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 *         shippingAddress:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             postalCode:
 *               type: string
 *             country:
 *               type: string
 *           description: Shipping address
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed]
 *           description: Payment status
 *         orderStatus:
 *           type: string
 *           enum: [processing, shipped, delivered, cancelled]
 *           description: Order status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order was created
 *       example:
 *         _id: "60d21b4667d0d8992e610c90"
 *         user: "60d21b4667d0d8992e610c85"
 *         products: [
 *           {
 *             product: "60d21b4667d0d8992e610c87",
 *             quantity: 5,
 *             price: 2.99
 *           },
 *           {
 *             product: "60d21b4667d0d8992e610c88",
 *             quantity: 2,
 *             price: 1.99
 *           }
 *         ]
 *         totalAmount: 18.93
 *         shippingAddress: {
 *           street: "123 Main St",
 *           city: "Anytown",
 *           state: "State",
 *           postalCode: "12345",
 *           country: "Country"
 *         }
 *         paymentStatus: "paid"
 *         orderStatus: "processing"
 *         createdAt: "2023-01-01T12:00:00Z"
 */
