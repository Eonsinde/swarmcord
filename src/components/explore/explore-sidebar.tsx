"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Category, Profile } from "@prisma/client"
import { useActiveExploreLink } from "@/hooks/use-active-explore-link"
import NavigationFooter from "@/components/navigation/navigation-footer"
import ExploreItem from "./explore-item"

type Props = {
    profile?: Profile
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

const ExploreSidebar = ({ profile, categories }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams?.get("category");
    const { activeLink, setActiveLink } = useActiveExploreLink(state => state);

    // TODO: convert this component into a server comp and fetch categories here
    // then, create a new component to render categories

    useEffect(() => {
        if (activeLink)
            return router.push(`/explore/?category=${activeLink || category}`);

        setActiveLink(category || "communities");
        return router.push(`/explore/?category=${category || "communities"}`);
    }, [activeLink, category]);

    return (
        <div className="h-full w-full flex flex-col bg-[#F2F3F5] dark:bg-[#2B2C31]">
            <h1 className="text-foreground text-xl p-3 font-bold">Explore</h1>
            <div className="flex-1 mt-2 px-3">
                <ExploreItem
                    iconName="Home"
                />
                {categories.map((category) => (
                    <ExploreItem
                        key={category.name}
                        name={category.name}
                        iconName={iconMap[category.name]}
                    />
                ))}
            </div>
            <NavigationFooter profile={profile} />
        </div>
    );
}
 
export default ExploreSidebar