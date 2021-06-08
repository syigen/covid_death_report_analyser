import { useEffect, useState } from "react";

const AboutUsModal = ({ close, rawData }) => {
    const [data, setData] = useState();
    useEffect(() => {
        if (rawData) {
            const data = rawData.about_report;
            setData(data);
        }
    }, [rawData])
    return (
        <> {data && <div className={" fixed w-full h-full top-0 left-0 flex items-center justify-center"}>
            <div class="absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div class="py-4 text-left px-6  bg-gray-900 text-blue-50 z-50">
                <div class="flex justify-between items-center pb-3">
                    <p class="text-2xl font-bold text-gray-50">About us</p>
                    <div class="cursor-pointer z-50" onClick={close}>
                        <svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                        </svg>
                    </div>
                </div>

                <ul>
                    <li>We used,</li>
                    <li>{data.total_press_release} Press releasesd and we extract
                     {data.total_records} Indcidents. These press released {data.from_date} {data.to_date}
                    </li>
                </ul>

                <ul>
                    <li class="my-1">  COVID-19 Pandamic Report Analysis  Copyright (C) 2021
                        <span class="font-bold"> SYIGEN PRIVATE LIMITED</span>
                    </li>
                    <li>
                        <a class="text-gray-50" href={'https://www.gnu.org/licenses/gpl-3.0.html'}>
                            This program is licenced under GPL-v3 </a>
                    </li>
                    <li class="my-4">
                        Contributors are wellcome  <a href={"https://github.com/syigen/covid_death_report_analyser"}>
                            Here</a>
                    </li>
                </ul>
                <div class="flex justify-end pt-2">
                    <button
                        onClick={close}
                        class="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400">Close</button>
                </div>

            </div>
        </div>
        }
        </>
    )
}

export default AboutUsModal;