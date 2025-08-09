"use server"
import { appwriteConfig } from "@/lib/appwrite/config"
import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { Query, ID } from "node-appwrite"
import { avatarPlaceholderUrl } from "@/constants"
import { parseStringify, handleError } from "@/lib/utils"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
// we run this script on the server to avoid exposing the secret keys to the client-side for better security
// types
type UserForm = {
  email: string
  fullName: string
}
export const getUserEmail = async (email: string) => {
  const { databases } = await createAdminClient()

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  )

  return result?.total > 0 ? result.documents[0] : null
}

export const sendEmailOTP = async (email: string) => {
  try {
    const { account } = await createAdminClient()
    const session = await account.createEmailToken(ID.unique(), email)
    return session.userId
  } catch (error) {
    handleError(error, "Failed to send email OTP")
  }
}

export const createAccount = async ({ email, fullName }: UserForm) => {
  const existingEmail = await getUserEmail(email)

  const accountId = await sendEmailOTP(email)
  if (!accountId) handleError("error", "No account id")

  if (!existingEmail) {
    // if there's no email, create one
    const { databases } = await createAdminClient()
    const newUserInfo = {
      fullName,
      email,
      avatar: avatarPlaceholderUrl,
      accountId,
    }

    databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      newUserInfo
    )
  }

  return parseStringify({ accountId })
}

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string
  password: string
}) => {

  try { 
    const { account } = await createAdminClient()
    const session = await account.createSession(accountId, password)
    ;(await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    return parseStringify({ sessionId: session.$id })
  } catch {
    handleError("error", "Failed to verify OTP")
  }
}

export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient()
  const result = await account.get()

  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("accountId", result.$id)]
  )

  if (user.total <= 0) return null

  return parseStringify(user.documents[0])
}

export const signUserOut = async () => {
  try {
    const { account } = await createSessionClient()
    await account.deleteSession("current")
    ;(await cookies()).delete("appwrite-session")
  } catch (error) {
    handleError(error, "Failed to sign out user.")
  } finally {
    redirect("/sign-in")
  }
}

export const signUserIn = async ({email} : {email: string}) => {
  try {
    const existingUser = await getUserEmail(email);

    if(existingUser){
      await sendEmailOTP(email);
      return parseStringify({accountId: existingUser.accountId});
    }

    return parseStringify({accountId: null, error: "User not Found"});
  }catch (error) {
     handleError(error, "Failed to sign In user.")
  }

}