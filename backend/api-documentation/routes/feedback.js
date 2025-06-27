/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: User feedback operations
 */

/**
 * @swagger
 * /api/feedback/submit:
 *   post:
 *     summary: Submit feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - city
 *               - state
 *               - message
 *               - customerSatisfaction
 *               - isWebsiteUseful
 *               - productFeedback
 *               - overallRating
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "1234567890"
 *               city:
 *                 type: string
 *                 description: User's city
 *                 example: "New York"
 *               state:
 *                 type: string
 *                 description: User's state
 *                 example: "NY"
 *               message:
 *                 type: string
 *                 description: User's feedback message
 *                 example: "Your website is great but could use some improvements."
 *               customerSatisfaction:
 *                 type: string
 *                 description: Customer satisfaction level
 *                 enum: [Happy, Neutral, Sad]
 *                 example: "Happy"
 *               isWebsiteUseful:
 *                 type: string
 *                 description: Whether the website is useful
 *                 enum: [Yes, No]
 *                 example: "Yes"
 *               productFeedback:
 *                 type: string
 *                 description: Feedback on the products
 *                 enum: [Good, Bad, Ok, Excellent]
 *                 example: "Excellent"
 *               overallRating:
 *                 type: string
 *                 description: Overall rating of the website (1-5)
 *                 example: "5"
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
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
 *                   example: "Feedback submitted successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All fields are required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to submit feedback"
 */

/**
 * @swagger
 * /api/feedback/get:
 *   get:
 *     summary: Get all feedback (admin only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 feedback:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone:
 *                         type: string
 *                         example: "1234567890"
 *                       city:
 *                         type: string
 *                         example: "New York"
 *                       state:
 *                         type: string
 *                         example: "NY"
 *                       message:
 *                         type: string
 *                         example: "Your website is great but could use some improvements."
 *                       customerSatisfaction:
 *                         type: string
 *                         example: "Happy"
 *                       isWebsiteUseful:
 *                         type: string
 *                         example: "Yes"
 *                       productFeedback:
 *                         type: string
 *                         example: "Excellent"
 *                       overallRating:
 *                         type: string
 *                         example: "5"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T12:00:00Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
