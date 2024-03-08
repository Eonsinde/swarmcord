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
        const { name, imageUrl, categoryId } = await req.json();
        const profile = await currentProfile();

        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });

        if (!name)
            return new NextResponse("Server name is missing", { status: 400 });

        if (!categoryId)
            return new NextResponse("Category ID is missing", { status: 400 });

        const defaultCategory = await db.category.findFirst({
            where: {
                name: "local community"
            }
        });

        if (!defaultCategory)
            return new NextResponse("Default Category not found", { status: 400 });

        const server = await db.server.create({
            data: {
                creatorId: profile.id,
                name,
                imageUrl: imageUrl || null,
                categoryId: categoryId || defaultCategory.id,
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
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[CREATE_SERVER]", error);
        return new NextResponse("Server Error", { status: 500 });
    }
}