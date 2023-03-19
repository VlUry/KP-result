import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCurrentUserData } from "../../store/users";

const NavProfile = () => {
    const [isOpen, setOpen] = useState(false);

    const currentUser = useSelector(getCurrentUserData());
    const toggleMenu = () => {
        setOpen((prev) => !prev);
    };

    if (!currentUser) return "Loading...";

    return (
        <div className="dropdown" onClick={toggleMenu}>
            <button className="btn dropdown-toggle d-flex align-items-center">
                <div className="mr-2">{currentUser.name}</div>
                <img
                    src={currentUser.image}
                    alt={currentUser.name}
                    height={40}
                    className="img-responsive rounded-circle"
                />
            </button>
            <div className={`w-100 dropdown-menu ${isOpen ? "show" : ""}`}>
                <Link
                    to={`/users/${currentUser._id}`}
                    className="dropdown-item"
                >
                    Profile
                </Link>
                <Link to="/logout" className="dropdown-item">
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default NavProfile;
