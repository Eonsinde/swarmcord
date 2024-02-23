import { useState, useEffect } from "react"

const useCurrentUrl = () => {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const origin = (typeof window !== "undefined") && (window.location.origin ?? "");

    if (!mounted)
        return "";

    return origin;
}
 
export default useCurrentUrl;