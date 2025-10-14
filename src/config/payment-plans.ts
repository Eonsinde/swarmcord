import {
    BASIC_PLAN_FEE,
    MAX_FILE_SIZE_BASIC,
    MAX_FILE_SIZE_TURBO,
    MAX_SERVERS_BASIC,
    MAX_SERVERS_TURBO,
    TURBO_PLAN_FEE
} from "./constants"

export const PLANS = [
    {
        name: "BASIC",
        slug: "basic",
        gradient: "from-blue-700 to-blue-400",
        quota: MAX_SERVERS_BASIC,
        coverImage: false,
        videoAudioChannels: false,
        imageSize: MAX_FILE_SIZE_BASIC,
        pricing: {
            amount: BASIC_PLAN_FEE,
            priceIds: {
                test: "price_1Q1wMpGVKfqa3frnVzhCXVyg",
                production: ""
            }
        }
    },
    {
        name: "TURBO",
        slug: "turbo",
        gradient: "from-purple-500 to-pink-500",
        quota: MAX_SERVERS_TURBO,
        coverImage: true,
        videoAudioChannels: true,
        imageSize: MAX_FILE_SIZE_TURBO,
        pricing: {
            amount: TURBO_PLAN_FEE,
            priceIds: {
                test: "price_1Q1wNRGVKfqa3frntlQiCftz",
                production: ""
            }
        }
    }
];