import { cookies } from "next/headers";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "./cognito";

const ACCESS = "accessToken";
const ID = "idToken";
const REFRESH = "refreshToken";

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const accessVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: COGNITO_CLIENT_ID,
});

const idVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "id",
  clientId: COGNITO_CLIENT_ID,
});

export type UserRole = "seller" | "customer" | null;

export async function setAuthCookies(tokens: {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}) {
  const jar = await cookies();
  jar.set(ACCESS, tokens.accessToken, { ...baseCookie, maxAge: 60 * 60 });
  jar.set(ID, tokens.idToken, { ...baseCookie, maxAge: 60 * 60 });
  jar.set(REFRESH, tokens.refreshToken, {
    ...baseCookie,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.delete(ACCESS);
  jar.delete(ID);
  jar.delete(REFRESH);
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS)?.value;
}

export async function getCurrentUser() {
  const jar = await cookies();
  const idToken = jar.get(ID)?.value;
  const accessToken = jar.get(ACCESS)?.value;
  if (!idToken || !accessToken) return null;

  try {
    await accessVerifier.verify(accessToken);
    const idPayload = await idVerifier.verify(idToken);

    const groups = (idPayload["cognito:groups"] as string[] | undefined) ?? [];
    const role: UserRole = groups.includes("sellers")
      ? "seller"
      : groups.includes("customers")
      ? "customer"
      : null;

    return {
      sub: idPayload.sub,
      email: idPayload.email as string | undefined,
      name: idPayload.name as string | undefined,
      role,
      groups,
      claims: idPayload,
    };
  } catch {
    return null;
  }
}

