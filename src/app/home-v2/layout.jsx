import React from 'react';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/Header';

const layout = ({ children }) => {
    return (
        <div className='main-page-area2'>
            <Header isTopBar={true}></Header>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default layout;