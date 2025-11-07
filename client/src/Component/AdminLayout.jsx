import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'


function AdminLayout({ children }) {
    return (
        <div className="container-scroller">

            <Navbar />
            <div className="container-fluid page-body-wrapper">
                <Sidebar />
                {children}
            </div>
        </div>
    )
}

export default AdminLayout