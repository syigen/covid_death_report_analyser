import { BellIcon } from "@heroicons/react/solid";
import { useState } from "react";

const InfoPanel = ({ sinhala, english }) => {

    const [isSinhala, setSinhala] = useState(true)
    const [isOpen] = useState(true)

    return (
        <>
            {isOpen && <div class="p-2 w-auto mx-auto  flex items-center space-x-4">
                <div class="flex-shrink-0">
                    <BellIcon className={"h-8 w-8 text-blue-500"} />
                </div>
                <div>
                    <p class="text-gray-100">
                        {(isSinhala) && sinhala}
                        {!isSinhala && english}
                    </p>
                    <p>
                        <span class="text-xs text-blue-200 cursor-pointer mr-2" onClick={() => {
                            setSinhala(!isSinhala);
                        }}>Translate</span>
                        {/* <span class="text-xs text-red-200 cursor-pointer mx-2" onClick={() => {
                            setOpen(!isOpen);
                        }}>Close</span> */}
                    </p>
                </div>
            </div>}
            {!isOpen && <div class="object-none object-right-top">
                <BellIcon className={"h-8 w-8 text-blue-500"} />
            </div>}

        </>
    );
}

export default InfoPanel