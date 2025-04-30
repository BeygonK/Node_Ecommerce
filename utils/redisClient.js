import Redis from "ioredis";
const redis = new Redis();
export const logoutUser = async (req, res) => {
  const token = req.cookies.accessToken;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    await redis.set(`bl_${decoded.jti}`, true, "EX", 15 * 60); // blacklist for 15 min
  }

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "Logged out" });
};

export default redis;
