/**
 * @swagger
 * components:
 *   schemas:
 *     Tool:
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
 *           description: Name of the tool
 *         description:
 *           type: string
 *           description: Description of the tool
 *         price:
 *           type: number
 *           description: Price of the tool
 *         image:
 *           type: string
 *           description: URL or path to the tool image
 *         category:
 *           type: string
 *           description: Category of the tool
 *         stockQuantity:
 *           type: number
 *           description: Available stock quantity
 *         condition:
 *           type: string
 *           description: Condition of the tool (new, used, etc.)
 *         createdBy:
 *           type: string
 *           description: User ID who created the tool listing
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the tool was listed
 *       example:
 *         _id: "60d21b4667d0d8992e610c89"
 *         name: "Garden Tiller"
 *         description: "Heavy-duty garden tiller for small to medium gardens"
 *         price: 149.99
 *         image: "tiller.jpg"
 *         category: "Garden Tools"
 *         stockQuantity: 10
 *         condition: "New"
 *         createdBy: "60d21b4667d0d8992e610c85"
 *         createdAt: "2023-01-01T12:00:00Z"
 */
