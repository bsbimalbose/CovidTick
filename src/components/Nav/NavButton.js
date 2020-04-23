import React from 'react'

export default function NavButton({icon, isActive, onClick}) {
    return (
        <div onClick={onClick} className={`nav-btn${isActive?' active': ''}`}>
            {icon}
        </div>
    )
}
