import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle';
import moment from 'moment';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { axiosAPI } from '../../services/index';
import { CONSTANTS } from '../../utils/constants';
import { getUserData } from '../../utils/Utility';

const AddFoodEntry = (props) => {
    const { open, close, updatedData } = props;

    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    let createdAt = "";

    useEffect(() => {
        if (date) {
            createdAt = moment(date).toISOString()
        }
    }, [date])

    const addFoodEntry = () => {
        if (name !== '' && calories !== '' && createdAt !== "") {
            try {
                axiosAPI.post('v1/add-foodentry', {
                    userid: getUserData().userid,
                    name,
                    price,
                    calories,
                    createdAt: createdAt,
                }).then((response) => {
                    setName('')
                    setCalories('')
                    setDate('')
                    close()
                    createdAt = "";
                    updatedData(response.data);

                })
            } catch (e) {
                console.error(e)
            }
        } else {

        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={close}
                color="primary"
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{CONSTANTS.ADD_FOOD_ENTRY}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="calorie"
                        label="Calories"
                        type="number"
                        fullWidth
                        value={calories}
                        onChange={(event) => setCalories(event.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        label="Price"
                        type="number"
                        fullWidth
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            renderInput={(props) => <TextField style={{ width: '100%', marginTop: 10 }}{...props} />}
                            label="Date & Time"
                            value={date}
                            ampm={false}
                            onChange={(newValue) => {
                                setDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={close}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={addFoodEntry} color="secondary" variant="outlined">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddFoodEntry;
