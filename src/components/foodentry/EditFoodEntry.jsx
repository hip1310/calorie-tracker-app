import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment'

import { CONSTANTS } from '../../utils/constants';
import { axiosAPI } from '../../services';
import { getUserData } from '../../utils/Utility';

const EditFoodEntry = (props) => {
    const { open, close, element, editData } = props;
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    let createdAt = ""

    useEffect(() => {
        if (date && time) {
            createdAt = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm:ss').toISOString();
        }
    }, [date, time])

    useEffect(() => {
        setName(element.name);
        setCalories(element.calories);
        setPrice(element.price);
        setDate(element.createdAt)
    }, [element])

    const editFoodWithCalories = () => {
        try {
            axiosAPI.put('v1/edit-foodentry', {
                name,
                calories,
                price,
                _id: element._id,
                userid: getUserData().userid,
            }).then((value) => {
                editData(value.data.data)
                close();
            })
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={close}
            color="primary"
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{CONSTANTS.EDIT_FOOD_ENTRY}</DialogTitle>
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
                    onClick={editFoodWithCalories} color="secondary" variant="outlined">
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(EditFoodEntry);
