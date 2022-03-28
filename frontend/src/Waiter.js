import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import style from "./style.css"
import AppNavbar from "./AppNavbar"

export default function Waiter() {
    return (
        <div>
            <AppNavbar />
            <div id="waiter">
                <CircularProgress color="success" />
            </div>
        </div>
    );
}