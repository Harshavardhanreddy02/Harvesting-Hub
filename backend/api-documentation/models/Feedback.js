/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - city
 *         - state
 *         - message
 *         - customerSatisfaction
 *         - isWebsiteUseful
 *         - productFeedback
 *         - overallRating
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email address
 *         phone:
 *           type: string
 *           description: User's phone number
 *         city:
 *           type: string
 *           description: User's city
 *         state:
 *           type: string
 *           description: User's state
 *         message:
 *           type: string
 *           description: User's feedback message
 *         customerSatisfaction:
 *           type: string
 *           description: Customer satisfaction level
 *           enum: [Happy, Neutral, Sad]
 *         isWebsiteUseful:
 *           type: string
 *           description: Whether the website is useful
 *           enum: [Yes, No]
 *         productFeedback:
 *           type: string
 *           description: Feedback on the products
 *           enum: [Good, Bad, Ok, Excellent]
 *         overallRating:
 *           type: string
 *           description: Overall rating of the website (1-5)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the feedback was created
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         name: "John Doe"
 *         email: "john@example.com"
 *         phone: "1234567890"
 *         city: "New York"
 *         state: "NY"
 *         message: "Your website is great but could use some improvements."
 *         customerSatisfaction: "Happy"
 *         isWebsiteUseful: "Yes"
 *         productFeedback: "Excellent"
 *         overallRating: "5"
 *         createdAt: "2023-01-01T12:00:00Z"
 */
