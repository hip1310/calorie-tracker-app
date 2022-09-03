import React from 'react';
import { Link } from "react-router-dom";

const GenericNotFound = () => {
    return (
        <>
            No Route found!!
            <Link to="/">Go To Home</Link>
        </>
    )
}

export default GenericNotFound;
