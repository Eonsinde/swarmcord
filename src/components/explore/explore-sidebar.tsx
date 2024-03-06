import { Category } from "@prisma/client"
import ExploreItem from "./explore-item"

type Props = {
    categories: Category []
}

const iconMap = {
    ["gaming"]: "",
    ["artists & creators"]: "",
    ["school club"]: "",
    ["friends"]: "",
    ["local community"]: "",
    ["study group"]: ""
}

const ExploreSidebar = async ({ categories }: Props) => {
    return (
        <div className="h-full w-full flex flex-col bg-[#F2F3F5] dark:bg-[#2B2C31]">
            <h1>Explore</h1>
            <div className="mt-2 px-3">
                {categories.map((category) => (
                    <ExploreItem
                        key={category.name}
                        name={category.name}
                        iconName={iconMap[category.name]}
                    />
                ))}
            </div>
        </div>
    );
}
 
export default ExploreSidebar