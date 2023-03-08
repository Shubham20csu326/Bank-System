import React from 'react'
import { useNavigate } from 'react-router-dom';

function header() {
    const navigate = useNavigate()
    const logout = () => {
        localStorage.clear();
        navigate("/")
    }
    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                {/* Container wrapper */}
                <div className="container">
                    {/* Navbar brand */}
                    <a className="navbar-brand me-2" href="https://mdbgo.com/">
                        <img src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp" height={16} alt="MDB Logo" loading="lazy" style={{ marginTop: '-1px' }} />
                    </a>
                    {/* Toggle button */}
                    <button className="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarButtonsExample" aria-controls="navbarButtonsExample" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars" />
                    </button>
                    {/* Collapsible wrapper */}
                    <div className="collapse navbar-collapse" id="navbarButtonsExample">
                        {/* Left links */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Banking</a>
                            </li>
                        </ul>
                        {/* Left links */}
                        <div className="d-flex align-items-center">

                            <a onClick={logout} className="btn btn-dark px-3" role="button"><i style={{ color: 'white' }} class="fa-solid fa-right-from-bracket"></i></a>
                        </div>
                    </div>
                    {/* Collapsible wrapper */}
                </div>
                {/* Container wrapper */}
            </nav>
            {/* Navbar */}
        </>
    )
}

export default header