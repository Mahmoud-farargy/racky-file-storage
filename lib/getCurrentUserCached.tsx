import { cache } from "react"
import { getCurrentUser } from "./actions/user.actions"

export const getCurrentUserCached = cache(async () => await getCurrentUser());
