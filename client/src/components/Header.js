import React from 'react';
import {useSelector} from 'react-redux';
// import './Header.css'; // Import the CSS file

function Header() {
    const {portfolioData} = useSelector((state) => state.root);
    const {headers} = portfolioData || {};
    const {firstLetter = '', middleLetter = '', lastLetter = ''} = headers || {};

    return (
        <div className='p-5 bg-primary flex justify-between header fixed-header'>
            <h1 className='text-secondary text-4xl font-bold'>{firstLetter || ''}</h1>
            <h1 className='text-white text-4xl font-bold'>{middleLetter || ''}</h1>
            <h1 className='text-tertiary text-4xl font-bold'>{lastLetter || ''}</h1>
        </div>
    );
}

export default Header;