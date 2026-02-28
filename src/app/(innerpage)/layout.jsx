'use client';
import React from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import { usePathname } from 'next/navigation';


const DefalultLayout = ({ children }) => {
    const pathname = usePathname();
    const hideChrome = (
        pathname === '/register' || pathname?.startsWith('/register/') ||
        pathname === '/login' || pathname?.startsWith('/login/')
    );

    return (
        <div className='main-page-area'>
            {!hideChrome && <Header isTopBar={true} />}
            {children}
            {!hideChrome && <Footer></Footer>}
        </div>
    );
};

export default DefalultLayout;