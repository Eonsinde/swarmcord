// to create a server
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { MemberRole } from "@prisma/client"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

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
            return NextResponse.json(allServers);
        }

        const existingCategory = await db.category.findFirst({
            where: {
                name: {
                    equals: category
                }
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
            return new NextResponse("Category not found", { status: 401 });
    
        const servers = existingCategory.servers;

        return NextResponse.json(servers);
    } catch (error) {
        console.log("[FETCH_SERVERS]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        const { name, type, imageUrl, categoryId } = await req.json();

        if (!(name || type || categoryId))
            return new NextResponse("Missing field is required", { status: 400 });

        let categoryIdToUse = categoryId;

        // incase the category Id isn't specified, get the default one and use
        if (!categoryId) {
            const defaultCategory = await db.category.findFirst({
                where: {
                    name: "local community"
                }
            });

            if (!defaultCategory)
                return new NextResponse("Default Category not found", { status: 400 });

            // update the category Id to use
            categoryIdToUse = defaultCategory.id;
        }

        const server = await db.server.create({
            data: {
                creatorId: profile.id,
                name,
                imageUrl: imageUrl || null,
                categoryId: categoryIdToUse,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", creatorId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            },
            include: {
                channels: {
                    where: {
                        name: "general"
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[CREATE_SERVER]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}