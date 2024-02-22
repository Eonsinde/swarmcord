"use client"
import { useRef, useState, useMemo, forwardRef, useCallback } from "react"
import Image from "next/image"
import axios, { AxiosProgressEvent } from "axios"
import { twMerge } from "tailwind-merge"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { UploadDropzone, UploadButton } from "@/lib/uploadthing"
import { X, LucideUploadCloud, Loader2 } from "lucide-react"
import { Button } from "./ui/button"

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

    console.log("imageUrl:", imageUrl);

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
        disabled,
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length !== 0) {
                console.log("\n\n\nselected files", acceptedFiles.map(item => ({ name: item.name, type: item.type, size: item.size })));

                await uploadFile({ files: acceptedFiles.map(item => ({ name: item.name, type: item.type, size: item.size })) });
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

    const uploadFile = useCallback(async (data: { files: any [] }) => {
        setIsUploading(true);

        try {
            const response = await axios.post(`/api/uploadthing?actionType=upload&slug=${endpoint}`, (data), { onUploadProgress });
            onChange(response.data[0].url);
        } catch(error){
            setIsUploadError(true);
        } finally {
            setIsUploading(false);
        }
    }, [endpoint]);

    if (imageUrl && fileType !== "pdf")
        return (
            <div className="relative h-20 w-20">
                <Image
                    className="rounded-full"
                    src={imageUrl}
                    fill
                    alt={"selected upload image"}
                />
                <button
                    className="absolute top-0 right-0 bg-indigo-600 hover:bg-indigo-600/90 text-white p-1 rounded-full"
                    onClick={() => onChange(undefined)}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )

    return (
        <div>
            {/* <Button
                className="relative min-w-[120px] overflow-hidden"
                variant="primary"
                type="button"
                disabled={isUploading}
            >
                <UploadButton
                    className="absolute bottom-0 h-full w-full opacity-0"
                    appearance={{
                        allowedContent: {
                            display: "none"
                        }
                    }}
                    content={{
                        button: () => <></>,
                        clearBtn: () => <></>
                    }}
                    endpoint={endpoint}
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
                        className="absolute right-0 h-full bg-indigo-300/50 transition-all ease-out"
                        style={{ width: `${100-uploadProgress}%` }}
                    />
                    <Loader2 className="h-6 w-6 text-center animate-spin" />
                </div>
                :
                `Upload File`}
            </Button> */}
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
                {imageUrl ? (
                    // Image Preview
                    <img
                        className="h-full w-full rounded-md object-cover"
                        src={imageUrl}
                        alt={acceptedFiles[0]?.name}
                    />
                ) : (
                    // Upload Icon
                    <div className="flex flex-col justify-center items-center space-y-4 text-muted-foreground">
                        <LucideUploadCloud className="h-12 w-12" />
                        <div className="text-sm">Drag & Drop to upload</div>
                        
                    </div>
                )}
                {/* Remove Image Icon */}
                {imageUrl && !disabled && (
                    <div
                        className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform"
                        onClick={(e) => {
                            e.stopPropagation();
                            void onChange?.(undefined);
                        }}
                    >
                        <div className="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
                            <X
                                className="text-gray-500 dark:text-gray-400"
                                width={16}
                                height={16}
                            />
                        </div>
                    </div>
                )}
            </div>
            {/* Error Text */}
            <div className="mt-1 text-xs text-red-500">{errorMessage}</div>
        </div>
        
    );
});

const onUploadProgress = (event: AxiosProgressEvent) => {
    const percentCompleted = Math.round((event.loaded * 100) / event.total!);
    console.log('onUploadProgress', percentCompleted);
};

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