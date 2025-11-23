import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"

export const fetchServers = async (category: string) => {
    try {
        const profile = await currentProfile();

        if (!profile)
            return null;

        if (!category || category === "communities") {
            // return all servers if no category is providee
            const allServers = await db.server.findMany({
                include: {
                    members: true,
                    channels: {
                        where: {
                            default: true
                        },
                        orderBy: {
                            createdAt: "asc"
                        }
                    }
                }
            });
            return allServers;
        }

        // in the presence of a category, get all related servers
        const existingCategory = await db.category.findFirst({
            where: {
                name: category
            },
            include: {
                servers: {
                    include: {
                        members: true,
                        channels: {
                            where: {
                                default: true
                            },
                            orderBy: {
                                createdAt: "asc"
                            }
                        }
                    }
                }
            }
        });
    
        if (!existingCategory)
            return null;
    
        const servers = existingCategory.servers;

        return servers;
    } catch {
        return null;
    }
}