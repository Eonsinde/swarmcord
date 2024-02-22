/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "uploadthing.com",
            "utfs.io",
            "uploadthing-prod-sea1.s3.us-west-2.amazonaws.com",
            "files.edgestore.dev"
        ]
    }
}

module.exports = nextConfig
