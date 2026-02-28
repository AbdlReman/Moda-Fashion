import React from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';

const DefalultLayout = ({ children }) => {
    return (
        <div className='main-page-area'>
            <Header isTopBar={true}></Header>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default DefalultLayout;