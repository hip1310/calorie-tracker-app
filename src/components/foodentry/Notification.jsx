import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { pink } from '@mui/material/colors';
import { CONSTANTS } from '../../utils/constants';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Notification = ({
    priceForMonth,
    userFoodData,
}) => {
    const [userFilteredFoodData, setUserFilteredFoodData] = useState()

    React.useEffect(() => {
        if (userFoodData) {
            const filteredData = userFoodData.filter((element) => element.createdAt[0] != null)
        
            const result = filteredData.reduce((acc, account) => {
                let match = acc.find(r => r.createdAt[0] === account.createdAt[0]);

                if(match) {
                match._id.push(...account._id); //push previous array
                } else {
                const act = { ...account }; 
                act._id = account._id.filter((obj) => Object.keys(obj).length);
                acc.push(act);
                }
                return acc;
        }, [])
        const sortedArray = result.sort(function(a,b){
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setUserFilteredFoodData(sortedArray);
        }
    }, [userFoodData])

    const data = [
        {
            date: 'May 15, 2022', entries: [{ name: 'Bread', calories: 30, time: '4:30 pm' },
            { name: 'Butter', calories: 40, time: '5:50 pm' }]
        },
        {
            date: 'May 14, 2022', entries: [{ name: 'Pizza', calories: 60, time: '12:10 pm' },
            { name: 'salad', calories: 20, time: '5:50 pm' }]
        }
    ]
    return (
        <PopupState variant="popper" popupId="demo-popup-popper">
            {(popupState) => (
                <div>
                    <WarningAmberIcon sx={{ color: pink[500] }} {...bindToggle(popupState)} />
                    <Popper {...bindPopper(popupState)} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <Paper style={{ minWidth: '800px', zIndex: 10 }}>
                                    {priceForMonth > CONSTANTS.PRICE_THRESHOLD && <Typography sx={{ p: 2, color: 'red' }}>{`The monthly price limit $${priceForMonth} exceeded the limit of $${CONSTANTS.PRICE_THRESHOLD}.`}</Typography>}
                                    <Typography sx={{ p: 2 }}>
                                        {userFilteredFoodData.map((element, index) => {
                                            let caloriesTotal = 0;
                                            return (
                                                <>
                                                    <Typography sx={{fontWeight:'bold'}}>{element.createdAt}</Typography>
                                                    <br />
                                                    <div>{element._id.map((food, index) => {
                                                        caloriesTotal = caloriesTotal + food.calories
                                                        return (
                                                             <Box sx={ { flexGrow: 1 }}>
                                                             <Grid container spacing={2}>
                                                               <Grid item xs={6}>
                                                                 <Typography>{food.name}</Typography>
                                                               </Grid>
                                                               <Grid item xs={3}>
                                                                 <Typography>{food.calories}</Typography>
                                                               </Grid>
                                                               <Grid item xs={3}>
                                                                 <Typography>{`$${food.price}`}</Typography>
                                                               </Grid>
                                                             </Grid>
                                                           </Box>
                                                        )
                                                    })}
                                                     {caloriesTotal > CONSTANTS.CALORIES_THRESHOLD && <Typography sx={{ p: 2, color: 'red' }}>The calorie intake is {caloriesTotal},  exceeded the daily limit of {CONSTANTS.CALORIES_THRESHOLD}.</Typography>}
                                                    </div>
                                                    <br />
                                                </>
                                            )
                                        })}
                                    </Typography>
                                </Paper>
                            </Fade>
                        )}
                    </Popper>
                </div>
            )}
        </PopupState>
    );
}

export default Notification;
