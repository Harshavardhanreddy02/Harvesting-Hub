const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required." });
  }

  // Safely access role and convert to lowercase for case-insensitive comparison
  const userRole = req.user.role ? req.user.role.toLowerCase() : "";

  if (userRole !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
  }

  next();
};

export default adminMiddleware;
