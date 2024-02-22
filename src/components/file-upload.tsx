"use client"
import { useRef, useState } from "react"
import Image from "next/image"
import { UploadDropzone, UploadButton } from "@/lib/uploadthing"
import { X, LucideUploadCloud, Loader2 } from "lucide-react"
import { Button } from "./ui/button"

type Props = {
    value: string,
    endpoint: "serverImage" | "messageFile",
    onChange: (url?: string) => void
}

const FileUpload = ({ value, endpoint, onChange }: Props) => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const isUploadingRef = useRef<boolean>(false);

    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image
                    className="rounded-full"
                    src={value}
                    fill
                    alt={"selected upload image"}
                />
                <button
                    className="absolute top-0 right-0 bg-indigo-600 hover:bg-indigo-600/90 text-white p-1 rounded-full"
                    onClick={() => onChange("")}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <Button
            className="relative min-w-[120px] overflow-hidden"
            variant="primary"
            type="button"
            disabled={isUploading}
        >
            <UploadButton
                className="absolute bottom-0 h-full w-full opacity-0"
                content={{
                    allowedContent: () => <></>,
                    button: () => <></>,
                    clearBtn: () => <></>
                }}
                endpoint="serverImage"
                onClientUploadComplete={(res) => {
                    onChange(res?.[0].url);
                    setIsUploading(false);
                    setUploadProgress(0);
                }}
                onUploadBegin={() => setIsUploading(true)}
                onUploadProgress={(value) => setUploadProgress(value)}
            />
            {isUploading
            ?
            <div className="flex justify-center items-center">
                <div
                    className="absolute right-0 h-full bg-indigo-300/50"
                    style={{ width: `${100-uploadProgress}%` }}
                />
                <Loader2 className="h-6 w-6 text-center animate-spin" />
            </div>
            :
            `Upload File`}
        </Button>
        // button: (args) => (
        //     <button
        //         className="relative h-full w-full bg-indigo-600 hover:bg-indigo-600/90 text-white rounded-md"
        //         disabled={args.isUploading}
        //     >
        //         {args.isUploading
        //         ?
        //         <div className="flex justify-center items-center">
        //             <div
        //                 className="absolute h-full bg-indigo-300/50"
        //                 style={{ width: `${args.uploadProgress}%` }}
        //             />
        //             <Loader2 className="h-6 w-6 text-center animate-spin" />
        //             {args.uploadProgress}
        //         </div>
        //         :
        //         <p className="text-center text-sm">Upload</p>}
        //     </button>
        // ),
        // <UploadDropzone
        //     className="w-full border-input text-muted-foreground"
        //     content={{
        //         uploadIcon: () => (<LucideUploadCloud className="h-12 w-12" />),
        //         // allowedContent: (args) => (<></>),
        //         label: () => <p className="text-md text-indigo-600">Choose Files/Drag & Drop</p>
        //     }}
        //     endpoint={endpoint}
        //     onClientUploadComplete={(res) => onChange(res?.[0].url)}
        //     onUploadError={(error: Error) => console.error("FileUpload error:", error)}
        // />
    );
}
 
export default FileUpload;