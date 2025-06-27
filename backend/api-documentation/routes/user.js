/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /api/user/get-user-profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 user_details:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/update-profile:
 *   post:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               contact_number:
 *                 type: string
 *                 example: "1234567890"
 *               personal_address:
 *                 type: string
 *                 example: "123 Main St, Anytown"
 *               business_name:
 *                 type: string
 *                 example: "John's Farm"
 *               business_email:
 *                 type: string
 *                 example: "business@example.com"
 *               business_contact_number:
 *                 type: string
 *                 example: "9876543210"
 *               business_address:
 *                 type: string
 *                 example: "456 Business Rd, Cityville"
 *               business_account_number:
 *                 type: string
 *                 example: "123456789"
 *               business_gstin:
 *                 type: string
 *                 example: "GST123456"
 *               business_about:
 *                 type: string
 *                 example: "We provide fresh organic produce."
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: "Profile updated successfully"
 *                 user_details:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/user/profile-image:
 *   post:
 *     summary: Upload or get profile image
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               user_auth_token:
 *                 type: string
 *                 example: "Bearer your-token-here"
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image processed successfully
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
 *                   example: "Profile image uploaded successfully"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/count:
 *   get:
 *     summary: Get total user count (admin dashboard)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Total user count
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
 * /api/user/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: "Server is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-05-15T12:34:56Z"
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile (alternative endpoint)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 user_details:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/profile/update:
 *   post:
 *     summary: Update user profile (alternative endpoint)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               contact_number:
 *                 type: string
 *                 example: "1234567890"
 *               personal_address:
 *                 type: string
 *                 example: "123 Main St, Anytown"
 *               business_name:
 *                 type: string
 *                 example: "John's Farm"
 *               business_email:
 *                 type: string
 *                 example: "business@example.com"
 *               business_contact_number:
 *                 type: string
 *                 example: "9876543210"
 *               business_address:
 *                 type: string
 *                 example: "456 Business Rd, Cityville"
 *               business_account_number:
 *                 type: string
 *                 example: "123456789"
 *               business_gstin:
 *                 type: string
 *                 example: "GST123456"
 *               business_about:
 *                 type: string
 *                 example: "We provide fresh organic produce."
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: "Profile updated successfully"
 *                 user_details:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
