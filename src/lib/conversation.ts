import { db } from "@/lib/db"

const getConversations = async (membershipIds: string []) => {
    try {
        return await db.conversation.findMany({
            where: {
                OR: [
                    {
                        profileOneId: {
                            in: membershipIds
                        }
                    },
                    {
                        profileTwoId: {
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
                profileOne: {
                    include: {
                    }
                },
                profileTwo: {
                    include: {
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

const getOrCreateConversation = async (profileOneId: string, profileTwoId: string) => {
    try {
        let conversation = null;
        
        conversation = await findConversation(profileOneId, profileTwoId);
        // let existingConversation = await findConversation(profileOneId, profileTwoId) || await findConversation(profileTwoId, profileOneId);

        if (!conversation)
            conversation = await createNewConversation(profileOneId, profileTwoId);
    
        return conversation;
    } catch {
        return null;
    }
}

const findConversation = async (profileOneId: string, profileTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                OR: [
                    { profileOneId: profileTwoId, profileTwoId: profileOneId },
                    { profileOneId, profileTwoId }
                ]
            },
            include: {
                profileOne: true,
                profileTwo: true
            }
        });
    } catch {
        return null;
    }
}

const createNewConversation = async (profileOneId: string, profileTwoId: string) => {
    try {
        const conversation = await db.conversation.create({
            data: {
                profileOneId,
                profileTwoId
            },
            include: {
                profileOne: true,
                profileTwo: true
            }
        });

        return conversation;
    } catch (err) {
        return null;
    }
}

export {
    getConversations,
    getOrCreateConversation,
    getConversationById
}