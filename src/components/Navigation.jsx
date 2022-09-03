import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { CONSTANTS } from '../utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAdmin, getUserData } from '../utils/Utility';
import Notification from './foodentry/Notification';

const Navigation = ({
    priceForMonth,
    userFoodData,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isAdminPanel = isAdmin() && location.pathname !== '/dashboard';
    const isNotification = !isAdmin() && location.pathname !== '/dashboard';

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => navigate({ pathname: '/' })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate({ pathname: '/' })}>
                        {CONSTANTS.APP_NAME}
                    </Typography>
                    {isNotification && <Notification priceForMonth={priceForMonth} userFoodData={userFoodData}/>}
                    {isAdminPanel &&<Button variant="contained" color="success" onClick={() => navigate({ pathname: '/dashboard' })}>
                        Dashboard
                    </Button>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navigation;
