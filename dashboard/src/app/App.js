import React, { useEffect, useState } from 'react';
import Dashboard from '../pages/dashboard';
import './App.css';
import githubLogo from '../githublogo.png'
import { InformationCircleIcon } from '@heroicons/react/solid'
import Popup from 'reactjs-popup';
import AboutUsModal from '../components/ui/abou_us_modal';
import Api from "../api";

const Announcement = () => {
    const [show, setShow] = useState(true);
    return (
        <>
            {show &&

                <div class="bg-indigo-600">
                    <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                        <div class="flex items-center justify-between flex-wrap">
                            <div class="w-0 flex-1 flex items-center">
                                <span class="flex p-2 rounded-lg bg-indigo-800">
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                    </svg>
                                </span>
                                <p class="ml-3 font-medium text-white">
                                    This report is based on data extracted from 
                                    <a href="www.dgi.gov.lk" class="font-bold pl-1">Government Press Release</a>.
                                     There can be +/- 5% error due to data collection/processing.
                                </p>
                            </div>
                            <div class="order-3 md:span-12 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                                <a href="https://www.dgi.gov.lk/news/press-releases-sri-lanka/covid-19-documents"
                                    target="blank"
                                    class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                                    Official reports
        </a>
                            </div>
                            <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                                <button type="button"
                                    onClick={
                                        () => {
                                            setShow(!show);
                                        }
                                    }
                                    class="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                                    <span class="sr-only">Dismiss</span>
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </>
    );
}

const App = () => {

    const [dataMap, setDataMap] = useState();

    useEffect(() => {
        const getData = async () => {
            const data_raw = await Api();
            setDataMap(data_raw)
        }
        getData();
    }, [])

    return (
        <>
            <div className="w-full h-full bg-gray-800">

                <nav class="mb-2 font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-gray-800 shadow sm:items-baseline w-full">
                    <div class="mb-2 sm:mb-0 inner">

                        <a href="/" class="text-2xl text-white no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold">SYIGEN-COVID-ANALYZER</a><br />
                        <span class="text-xs text-gray-50">COVID-19 Pandamic Report Analysis</span>
                        {(dataMap && dataMap.about_report) && <span class="text-xs text-gray-50 ml-2">(Last update - {dataMap.about_report.last_update_time})</span>}

                    </div>

                    <div class="sm:mb-0 self-center">


                        <Popup trigger={
                            <button>
                                <InformationCircleIcon className={"h-8 w-8 text-gray-500"} />
                            </button>
                        } modal nested={false}>
                            {close => (
                                <AboutUsModal close={close} rawData={dataMap} />)}

                        </Popup>

                    </div>


                </nav>
                <div className={"p-4 pt-2"}>
                    <Announcement />
                    <Dashboard dataMap={dataMap} />
                </div>


                <div class="mb-2 font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-gray-800 shadow sm:items-baseline w-full">
                    <div class="mb-2 sm:mb-0 inner">

                        {/* <a href="/" >SYIGEN-COVID-ANALYZER</a><br /> */}
                        <span class="text-sm text-white no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold">
                            COVID-19 Pandemic Report Analysis
                            Copyright (C) 2021 Syigen (Private) Limited
                </span>
                        <p>
                            <a class="text-xs text-gray-50" href={'https://www.gnu.org/licenses/gpl-3.0.html'}>
                                This program is licensed under GPL-v3
                        </a>
                        </p>
                    </div>

                    <div class="sm:mb-0 self-center">

                        <a href={"https://github.com/syigen/covid_death_report_analyser"}>
                            <img src={githubLogo} alt="Source Code" class="h-6" />
                        </a>

                    </div>


                </div>
            </div>

        </>
    );
}

export default App;
