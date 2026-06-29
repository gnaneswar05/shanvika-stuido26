import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shanvika-studio-luxury-gold-2026-secret";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req) {
  // Try checking from cookies first
  let token = null;
  
  if (req.cookies && typeof req.cookies.get === "function") {
    const cookie = req.cookies.get("token");
    if (cookie) token = cookie.value;
  }

  // Fallback to headers
  if (!token) {
    const authHeader = req.headers.get?.("authorization") || req.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export function verifyAuth(req) {
  const decoded = getAuthUser(req);
  if (!decoded) {
    throw new Error("Unauthorized access");
  }
  return decoded;
}
