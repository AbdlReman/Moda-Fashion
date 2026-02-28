import React from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';

const layout = ({ children }) => {
    return (
        <div className='main-page-area3'>
           <Header variant="cs_type_1"></Header>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default layout;