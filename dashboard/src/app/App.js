import React from 'react';
import Dashboard from '../pages/dashboard';
import './App.css';
import githubLogo from '../githublogo.png'

const App = () => {


    return (
        <div className="w-full h-full bg-gray-800">

            <nav class="mb-2 font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-gray-800 shadow sm:items-baseline w-full">
                <div class="mb-2 sm:mb-0 inner">

                    <a href="/" class="text-2xl text-white no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold">SYIGEN-COVID-ANALYZER</a><br />
                    <span class="text-xs text-gray-50">COVID-19 Pandamic Report Analysis</span>

                </div>

                <div class="sm:mb-0 self-center">

                    <a href="https://github.com/syigen/covid_death_report_analyser" class="text-md no-underline text-white hover:text-blue-100 ml-2 px-1">About us</a>

                </div>


            </nav>
            <div className={"p-4 pt-2"}>
                <Dashboard />
            </div>


            <div class="mb-2 font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-gray-800 shadow sm:items-baseline w-full">
                <div class="mb-2 sm:mb-0 inner">

                    {/* <a href="/" >SYIGEN-COVID-ANALYZER</a><br /> */}
                    <span class="text-sm text-white no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold">
                        COVID-19 Pandamic Report Analysis  Copyright (C) 2021  SYIGEN PRIVATE LIMITED
                </span>
                    <p>
                        <a class="text-xs text-gray-50" href={'https://www.gnu.org/licenses/gpl-3.0.html'}>
                            This program is licenced under GPL-v3
                        </a>
                    </p>
                </div>

                <div class="sm:mb-0 self-center">

                    <a href={"https://github.com/syigen/covid_death_report_analyser"}>
                        <img src={githubLogo} alt="Source Code" class="h-6" />
                    </a>

                </div>


            </div>
        </div >
    );
}

export default App;
