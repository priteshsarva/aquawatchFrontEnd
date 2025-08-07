import React from 'react'


import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Herosection from '../components/Herosection';


async function loadPreline() {
    return import('preline/dist/index.js');
}
const Home = () => {
    const location = useLocation();

    useEffect(() => {
        const initPreline = async () => {
            await loadPreline();

            if (
                window.HSStaticMethods &&
                typeof window.HSStaticMethods.autoInit === 'function'
            ) {
                window.HSStaticMethods.autoInit();
            }
        };

        initPreline();
    }, [location.pathname]);
    return (
        <div>
            
            <Herosection />
        </div>
    )
}

export default Home
