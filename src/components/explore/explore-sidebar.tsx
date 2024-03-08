"use client"
import { useEffect } from "react"
import { Category } from "@prisma/client"
import { useActiveExploreLink } from "@/hooks/use-active-explore-link"
import ExploreItem from "./explore-item"
import { useRouter, useSearchParams } from "next/navigation"

type Props = {
    categories: Category []
}

const iconMap = {
    ["gaming"]: "Gamepad2",
    ["artists & creators"]: "Palette",
    ["school club"]: "GraduationCap",
    ["friends"]: "HandMetal",
    ["local community"]: "Fence",
    ["study group"]: "Book"
}

const ExploreSidebar = ({ categories }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const { activeLink, setActiveLink } = useActiveExploreLink(state => state);

    useEffect(() => {
        if (activeLink)
            return router.push(`/explore/?category=${activeLink || category}`);

        setActiveLink("communities" || category);
        return router.push(`/explore/?category=${activeLink || category}`);
    }, [activeLink, category]);

    return (
        <div className="h-full w-full flex flex-col bg-[#F2F3F5] dark:bg-[#2B2C31]">
            <h1 className="text-foreground text-xl p-3 font-bold">Explore</h1>
            <div className="mt-2 px-3">
                <ExploreItem
                    id=""
                    iconName="Home"
                />
                {categories.map((category) => (
                    <ExploreItem
                        key={category.name}
                        id={category.id}
                        name={category.name}
                        iconName={iconMap[category.name]}
                    />
                ))}
            </div>
        </div>
    );
}
 
export default ExploreSidebar