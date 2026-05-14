export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      return next(err);
    }

    if (!allowedRoles.includes(user.role)) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
};
