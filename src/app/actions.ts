"use server";

import {
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { redirect } from "next/navigation";
import { cognitoClient, COGNITO_CLIENT_ID } from "@/lib/cognito";
import { setAuthCookies, clearAuthCookies, getAccessToken } from "@/lib/session";

type ActionResult = { error: string } | undefined;

export async function signUpAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");

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
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as any).message)
        : "Sign up failed";
    return { error: message };
  }

  redirect(`/confirm?email=${encodeURIComponent(email)}`);
}

export async function confirmAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
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
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as any).message)
        : "Confirmation failed";
    return { error: message };
  }

  redirect("/login?confirmed=1");
}

export async function resendCodeAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  try {
    await cognitoClient.send(
      new ResendConfirmationCodeCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
      })
    );
  } catch (err: unknown) {
    // Intentionally ignore: this action is invoked directly by <form action=...>,
    // which requires a void return type.
  }
}

export async function signInAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const response = await cognitoClient.send(
      new InitiateAuthCommand({
        ClientId: COGNITO_CLIENT_ID,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
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
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as any).message)
        : "Sign in failed";
    return { error: message };
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

