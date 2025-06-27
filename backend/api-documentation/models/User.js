/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         user_name:
 *           type: string
 *           description: User's username
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password (hashed)
 *         role:
 *           type: string
 *           enum: [customer, farmer, admin]
 *           description: User's role in the system
 *         personal_address:
 *           type: string
 *           description: User's personal address
 *         contact_number:
 *           type: string
 *           description: User's contact number
 *         profile_image_id:
 *           type: string
 *           description: User's profile image identifier
 *         business_name:
 *           type: string
 *           description: Business name (for farmers)
 *         business_email:
 *           type: string
 *           description: Business email address (for farmers)
 *         business_contact_number:
 *           type: string
 *           description: Business contact number (for farmers)
 *         business_address:
 *           type: string
 *           description: Business address (for farmers)
 *         business_account_number:
 *           type: string
 *           description: Business account number (for farmers)
 *         business_gstin:
 *           type: string
 *           description: Business GSTIN number (for farmers)
 *         business_about:
 *           type: string
 *           description: About the business (for farmers)
 *         profilePicture:
 *           type: string
 *           description: URL to user's profile picture
 *         wishlist:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product IDs in user's wishlist
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         user_name: "johndoe"
 *         email: "john@example.com"
 *         password: "$2a$10$Jdk6JZyGUfrXg3SahzJNO.Vh5PB3LgwXN3v0hB1fJFi9r2pVb9lJq"
 *         role: "farmer"
 *         personal_address: "123 Main St, Anytown"
 *         contact_number: "5551234567"
 *         profile_image_id: "profile123.jpg"
 *         business_name: "Green Farms"
 *         business_email: "contact@greenfarms.com"
 *         business_contact_number: "5559876543"
 *         business_address: "456 Farm Rd, Ruralville"
 *         business_account_number: "ACCT123456789"
 *         business_gstin: "GST123456789"
 *         business_about: "Organic farm growing vegetables and fruits since 2010"
 *         profilePicture: "https://example.com/profiles/john.jpg"
 *         wishlist: ["60d21b4667d0d8992e610c87", "60d21b4667d0d8992e610c88"]
 *         createdAt: "2023-01-01T12:00:00Z"
 */
