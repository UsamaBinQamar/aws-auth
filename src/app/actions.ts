"use server";

import {
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { redirect } from "next/navigation";
import { cognitoClient, COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "@/lib/cognito";
import { setAuthCookies, clearAuthCookies, getAccessToken } from "@/lib/session";

type ActionResult = { error: string } | undefined;

const ROLE_TO_GROUP = {
  seller: "sellers",
  customer: "customers",
} as const;

type Role = keyof typeof ROLE_TO_GROUP;

export async function signUpAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");
  const role = String(formData.get("role") ?? "") as Role;

  if (!ROLE_TO_GROUP[role]) {
    return { error: "Invalid role. Please choose seller or customer." };
  }

  try {
    await cognitoClient.send(
      new SignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          ...(name ? [{ Name: "name", Value: name }] : []),
        ],
      })
    );

    await cognitoClient.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: COGNITO_USER_POOL_ID,
        Username: email,
        GroupName: ROLE_TO_GROUP[role],
      })
    );
  } catch (err: any) {
    return { error: err?.message ?? "Sign up failed" };
  }

  redirect(`/confirm?email=${encodeURIComponent(email)}`);
}

export async function confirmAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const code = String(formData.get("code") ?? "");

  try {
    await cognitoClient.send(
      new ConfirmSignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
      })
    );
  } catch (err: any) {
    return { error: err?.message ?? "Confirmation failed" };
  }

  redirect("/login?confirmed=1");
}

export async function resendCodeAction(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  try {
    await cognitoClient.send(
      new ResendConfirmationCodeCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
      })
    );
  } catch (err: any) {
    return { error: err?.message ?? "Could not resend code" };
  }
}

export async function signInAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const response = await cognitoClient.send(
      new InitiateAuthCommand({
        ClientId: COGNITO_CLIENT_ID,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: { USERNAME: email, PASSWORD: password },
      })
    );

    const auth = response.AuthenticationResult;
    if (!auth?.AccessToken || !auth?.IdToken || !auth?.RefreshToken) {
      return { error: "Authentication failed" };
    }

    await setAuthCookies({
      accessToken: auth.AccessToken,
      idToken: auth.IdToken,
      refreshToken: auth.RefreshToken,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Sign in failed" };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const accessToken = await getAccessToken();
  if (accessToken) {
    try {
      await cognitoClient.send(new GlobalSignOutCommand({ AccessToken: accessToken }));
    } catch {
      // ignore
    }
  }

  await clearAuthCookies();
  redirect("/login");
}

