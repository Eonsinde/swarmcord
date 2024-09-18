"use server"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"

export const fetchCategories = async () => {
    try {
        const profile = await currentProfile();

        if (!profile)
            return null;

        const categories = await db.category.findMany();
    
        return categories;
    } catch {
        return null;
    }
}