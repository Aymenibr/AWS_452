const { sign,verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { id: user.id },
    process.env.JWT_SECRET,
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
   if (!accessToken) return res.status(400).json({ error: "User not Authenticated" });

  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }


}



module.exports = {createTokens, validateToken};