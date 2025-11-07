import React from 'react'

function Navbar() {
    return (
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">

                <span className='h5'><strong>Employee Time Tracking & Payroll System</strong></span>
            </div>
            <div className="navbar-menu-wrapper d-flex align-items-stretch">


                <ul className="navbar-nav navbar-nav-right">
                    <li className="nav-item  dropdown d-none d-md-block">
                        <a className="nav-link dropdown-toggle" id="reportDropdown" href="#" data-toggle="dropdown" aria-expanded="false"> Reports </a>
                        <div className="dropdown-menu navbar-dropdown" aria-labelledby="reportDropdown">
                            <a className="dropdown-item" href="#">
                                <i className="mdi mdi-file-pdf mr-2"></i>PDF </a>
                            <div className="dropdown-divider"></div>
                           
                        </div>
                    </li>




                </ul>

            </div>
        </nav>
    )
}

export default Navbar