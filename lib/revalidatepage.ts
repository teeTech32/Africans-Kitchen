"use server"

import { revalidatePath } from "next/cache"

export async function revalidatePage():Promise<void> {
  revalidatePath('/meals')
}