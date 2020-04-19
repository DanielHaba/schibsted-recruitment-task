import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <ul className="nav bg-light">
            <li className="nav-item">
                <Link className="nav-link" to="/">Issues</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/new-issue">New Issue</Link>
            </li>
        </ul>
    );
}
