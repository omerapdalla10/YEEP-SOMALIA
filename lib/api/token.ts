import jwt, { type SignOptions } from "jsonwebtoken";
import { jwt as jwtConfig } from "@/lib/env";
import type { Role } from "@/lib/roles";

export interface JwtPayload {
  /** User id. */
  sub: string;
  role: Role;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, jwtConfig.secret) as JwtPayload;
}
