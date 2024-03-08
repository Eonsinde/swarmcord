import axios from "axios"
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
                    members: {
                        include: {
                            _count: true
                        }
                    }
                }
            });
            return allServers;
        }

        const existingCategory = await db.category.findFirst({
            where: {
                name: category
            },
            include: {
                servers: {
                    include: {
                        members: {
                            include: {
                                _count: true
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