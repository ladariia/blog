import React from 'react';
import cl from './Header.module.css'

const Header = ({items}) => {

    return (
        <header className={cl.header}>
            <div className={cl.header__container}>
                <nav className={cl.header__nav}>
                    <ul>
                        {items.map(item =>
                        <li>
                            <a href="{item.href}">
                                <span>
                                    {item.icon}
                                </span>
                                {item.value}
                            </a>
                        </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;