/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Name of the product
 *         description:
 *           type: string
 *           description: Description of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         image:
 *           type: string
 *           description: URL or path to the product image
 *         category:
 *           type: string
 *           description: Category of the product
 *         stockQuantity:
 *           type: number
 *           description: Available stock quantity
 *         rating:
 *           type: number
 *           description: Average product rating
 *         createdBy:
 *           type: string
 *           description: User ID who created the product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the product was created
 *       example:
 *         _id: "60d21b4667d0d8992e610c87"
 *         name: "Organic Tomatoes"
 *         description: "Fresh organic tomatoes from local farms"
 *         price: 2.99
 *         image: "tomatoes.jpg"
 *         category: "Vegetables"
 *         stockQuantity: 100
 *         rating: 4.5
 *         createdBy: "60d21b4667d0d8992e610c85"
 *         createdAt: "2023-01-01T12:00:00Z"
 */
