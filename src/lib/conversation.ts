import { db } from "@/lib/db"

const getConversations = async (membershipIds: string []) => {
    try {
        return await db.conversation.findMany({
            where: {
                OR: [
                    {
                        memberOneId: {
                            in: membershipIds
                        }
                    },
                    {
                        memberTwoId: {
                            in: membershipIds
                        }
                    }
                ]
            }
        });
    } catch {
        return null;
    }
}

const getConversationById = async (conversationId: string) => {
    try {
        let conversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!conversation)
            return null;
        return conversation;
    } catch {
        return null;
    }
}

const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

        if (!conversation)
            conversation = await createNewConversation(memberOneId, memberTwoId);

        return conversation;
    } catch {
        return null;
    }
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                OR: [
                    { memberOneId },
                    { memberTwoId }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });
    } catch {
        return null;
    }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    } catch {
        return null;
    }
}

export {
    getConversations,
    getOrCreateConversation,
    getConversationById
}