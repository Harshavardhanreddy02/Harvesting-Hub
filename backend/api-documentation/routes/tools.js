/**
 * @swagger
 * tags:
 *   name: Tools
 *   description: Farming tools management operations
 */

/**
 * @swagger
 * /api/tool/list:
 *   get:
 *     summary: Get all tools
 *     tags: [Tools]
 *     responses:
 *       200:
 *         description: List of tools
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
 *                         example: "60d21b4667d0d8992e610c89"
 *                       name:
 *                         type: string
 *                         example: "Garden Tiller"
 *                       description:
 *                         type: string
 *                         example: "Heavy-duty garden tiller for small to medium gardens"
 *                       price:
 *                         type: number
 *                         example: 149.99
 *                       category:
 *                         type: string
 *                         example: "Garden Tools"
 *                       image:
 *                         type: string
 *                         example: "tiller.jpg"
 *                       stockQuantity:
 *                         type: number
 *                         example: 10
 *                       email:
 *                         type: string
 *                         example: "farmer@example.com"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tool/add:
 *   post:
 *     summary: Create a new tool
 *     tags: [Tools]
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
 *                 example: "Garden Tiller"
 *               price:
 *                 type: number
 *                 example: 149.99
 *               description:
 *                 type: string
 *                 example: "Heavy-duty garden tiller for small to medium gardens"
 *               category:
 *                 type: string
 *                 example: "Garden Tools"
 *               email:
 *                 type: string
 *                 example: "farmer@example.com"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Tool created successfully
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
 *                   example: "tool added successfully"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tool/:
 *   get:
 *     summary: Get all tools (alternative endpoint)
 *     tags: [Tools]
 *     responses:
 *       200:
 *         description: List of all tools
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tool'
 *       500:
 *         description: Error fetching tools
 */

/**
 * @swagger
 * /api/tool/{id}:
 *   get:
 *     summary: Get a tool by ID
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: Tool details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tool'
 *       404:
 *         description: Tool not found
 *       500:
 *         description: Error fetching tool
 */

/**
 * @swagger
 * /api/tool/update/{id}:
 *   put:
 *     summary: Update a tool (no auth required)
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Garden Tiller"
 *               price:
 *                 type: number
 *                 example: 159.99
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               category:
 *                 type: string
 *                 example: "Garden Tools"
 *               stockQuantity:
 *                 type: number
 *                 example: 15
 *     responses:
 *       200:
 *         description: Tool updated successfully
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
 *                   example: "Tool updated successfully"
 *                 tool:
 *                   $ref: '#/components/schemas/Tool'
 *       404:
 *         description: Tool not found
 *       500:
 *         description: Error updating tool
 */

/**
 * @swagger
 * /api/tool/{id}:
 *   put:
 *     summary: Update a tool (with auth)
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Tool updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Tool not found
 *       500:
 *         description: Error updating tool
 */

/**
 * @swagger
 * /api/tool/delete/{id}:
 *   post:
 *     summary: Delete a tool (no auth required)
 *     tags: [Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: Tool deleted successfully
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
 *                   example: "tool deleted successfully"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tool/{id}:
 *   delete:
 *     summary: Delete a tool (with auth)
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: Tool deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tool deleted successfully"
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Tool not found
 *       500:
 *         description: Error deleting tool
 */

/**
 * @swagger
 * /api/tool/search/{search}:
 *   get:
 *     summary: Search for tools
 *     tags: [Tools]
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
 *                     $ref: '#/components/schemas/Tool'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tool/topselling:
 *   get:
 *     summary: Get fast selling tools (low stock)
 *     tags: [Tools]
 *     responses:
 *       200:
 *         description: Top selling tools
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
 *                     $ref: '#/components/schemas/Tool'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tool/recentadded:
 *   get:
 *     summary: Get recently added tools
 *     tags: [Tools]
 *     responses:
 *       200:
 *         description: Recently added tools
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tool'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tool'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tool/count:
 *   get:
 *     summary: Get total tool count
 *     tags: [Tools]
 *     responses:
 *       200:
 *         description: Total tool count
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
 *                   example: 42
 *       500:
 *         description: Error counting tools
 */

/**
 * @swagger
 * /api/tool/:
 *   post:
 *     summary: Create a new tool with auth
 *     tags: [Tools]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Garden Tiller"
 *               price:
 *                 type: number
 *                 example: 149.99
 *               description:
 *                 type: string
 *                 example: "Heavy-duty garden tiller for small to medium gardens"
 *               category:
 *                 type: string
 *                 example: "Garden Tools"
 *               stockQuantity:
 *                 type: number
 *                 example: 10
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tool created successfully
 *       500:
 *         description: Error creating tool
 */
