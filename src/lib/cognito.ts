import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

if (!process.env.COGNITO_REGION) throw new Error("COGNITO_REGION is not set");
if (!process.env.COGNITO_USER_POOL_ID)
  throw new Error("COGNITO_USER_POOL_ID is not set");
if (!process.env.COGNITO_CLIENT_ID) throw new Error("COGNITO_CLIENT_ID is not set");

export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
});

export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
export const COGNITO_REGION = process.env.COGNITO_REGION;
