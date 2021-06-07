import React from 'react';
import Dashboard from '../pages/dashboard';
import './App.css';

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
            <Dashboard />
        </div >
    );
}

export default App;
