"use client"
import { useState, useMemo, forwardRef, useCallback } from "react"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { useEdgeStore } from "../lib/edgestore"
import { X, LucideUploadCloud, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const variants = {
    base: "relative rounded-md flex justify-center items-center flex-col cursor-pointer border-[1px] border-dashed border-input transition-colors duration-200 ease-in-out",
    image:
      "border-0 p-0 min-h-0 min-w-0 relative shadow-md bg-background rounded-md",
    active: "border-2",
    disabled:
      "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700",
    accept: "border border-indigo-600 bg-indigo-600 bg-opacity-10",
    reject: "border border-rose-700 bg-rose-700 bg-opacity-10",
};

const ERROR_MESSAGES = {
    fileTooLarge(maxSize: number) {
        return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
    },
    fileInvalidType() {
        return "Invalid file type.";
    },
    tooManyFiles(maxFiles: number) {
        return `You can only add ${maxFiles} file(s).`;
    },
    fileNotSupported() {
        return "The file is not supported.";
    }
};

type Props = {
    className?: string
    width?: number
    height?: number
    value?: File | string;
    onChange: (file?: File | string) => void | Promise<void>;
    endpoint: "serverImage" | "messageFile"
    disabled?: boolean
    dropzoneOptions?: Omit<DropzoneOptions, "disabled">
}

const FileUpload = forwardRef<HTMLInputElement, Props>(({
    className,
    height=220,
    width,
    value,
    endpoint,
    disabled,
    dropzoneOptions,
    onChange
}: Props, ref) => {
    const { edgestore } = useEdgeStore();

    const [file, setFile] = useState<File>();
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isUploadError, setIsUploadError] = useState<boolean>(false);

    const { imageUrl, fileType } = useMemo(() => {
        if (typeof value === "string") {
            const fileType = value?.split(".").pop();
            // in case a url is passed in, use it to display the image
            return { imageUrl: value, fileType  };
        } else if (value) {
            // in case a file is passed in, create a base64 url to display the image
            return { imageUrl: URL.createObjectURL(value), fileType: null };
        }

        return  { imageUrl: null, fileType: null  };
    }, [value]);

    // dropzone configuration
    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        fileRejections,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        disabled: disabled || isUploading,
        onDrop: async (acceptedFiles) => {
            setIsUploadError(false);

            const file = acceptedFiles[0];
            
            if (file) {
                setFile(file);
            }
        },
        ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = useMemo(
        () =>
            twMerge(
                variants.base,
                isFocused && variants.active,
                disabled && variants.disabled,
                imageUrl && variants.image,
                (isDragReject ?? fileRejections[0]) && variants.reject,
                isDragAccept && variants.accept,
                className
            ).trim(),
        [
            isFocused,
            imageUrl,
            fileRejections,
            isDragAccept,
            isDragReject,
            disabled,
            className
        ]
    );

    // error validation messages
    const errorMessage = useMemo(() => {
        if (fileRejections[0]) {
            const { errors } = fileRejections[0];

            if (errors[0]?.code === 'file-too-large') {
                return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
            } else if (errors[0]?.code === 'file-invalid-type') {
                return ERROR_MESSAGES.fileInvalidType();
            } else if (errors[0]?.code === 'too-many-files') {
                return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
            } else {
                return ERROR_MESSAGES.fileNotSupported();
            }
        } else if (isUploadError) {
            return "Something went wrong";
        }
        
        return undefined;
    }, [fileRejections, dropzoneOptions, isUploadError]);

    const uploadFile = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (file) {
            setIsUploading(true);

            try {
                const edgeStoreResponse = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                        // you can use this to show a progress bar
                        setUploadProgress(progress);
                    }
                });

                onChange(edgeStoreResponse.url);
            } catch(error){
                setIsUploadError(true);
            } finally {
                setIsUploading(false);
                setFile(undefined);
            }
        }
    }, [file, endpoint]);

    if (imageUrl && fileType !== "pdf")
        return (
            <div className={cn(
                "flex justify-center items-center",
                disabled && "opacity-50"
            )}>
                <div className="relative h-20 w-20">
                    <Image
                        className="object-cover rounded-full"
                        src={imageUrl}
                        fill
                        alt={"uploaded image"}
                    />
                    <button
                        className="absolute top-0 right-0 bg-indigo-600 hover:bg-indigo-600/90 disabled:hover:bg-indigo-600 text-white p-1 rounded-full"
                        onClick={() => {
                            setFile(undefined);
                            onChange(undefined)
                        }}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        )

    return (
        <div>
            <div
                {...getRootProps({
                    className: dropZoneClassName,
                    style: {
                        width: width ?? "100%",
                        height
                    }
                })}
            >
                {/* Main File Input */}
                <input
                    ref={ref}
                    {...getInputProps()}
                />
                {/* upload box */}
                <div className="relative flex flex-col justify-center items-center space-y-4 text-muted-foreground">
                    {isUploading
                    ?
                    <>
                        
                        <Loader2 className="h-12 w-12 animate-spin" />
                        <div className="text-sm">Uploading</div>
                    </>
                    :
                    <>
                        <LucideUploadCloud className="h-12 w-12" />
                        <div className="text-sm">Drag & Drop to upload</div>
                    </>}
                    {file && !isUploading && !errorMessage && (
                        <button
                            className="z-[1000] p-3 bg-transparent text-sm text-indigo-600 hover:text-indigo-600/90 underline"
                            onClick={uploadFile}
                        >
                            Upload File
                        </button>
                    )}
                    {/* Error Text */}
                    {errorMessage && <div className="mt-1 text-sm text-rose-500">{errorMessage}</div>}
                </div>
                {/* progress bar */}
                {isUploading && (
                    <div
                        className="absolute right-0 h-full bg-indigo-600 bg-opacity-10 transition-all ease-out"
                        style={{ width: `${100-uploadProgress}%` }}
                    />
                )}
            </div>
        </div>
    );
});

// const onUploadProgress = (event: AxiosProgressEvent) => {
//     const percentCompleted = Math.round((event.loaded * 100) / event.total!);
//     console.log('onUploadProgress', percentCompleted);
// };

function formatFileSize(bytes?: number) {
    if (!bytes) {
        return '0 Bytes';
    }
    
    bytes = Number(bytes);
    
    if (bytes === 0) {
        return '0 Bytes';
    }

    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
 
export default FileUpload;