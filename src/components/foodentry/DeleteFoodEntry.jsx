import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { CONSTANTS } from '../../utils/constants'
import { axiosAPI } from '../../services'

const DeleteFoodEntry = (props) => {
    const { open, close, deleteData, foodId } = props;
    const deleteFoodWithCalories = () => {
        try {
            axiosAPI.delete('v1/delete-foodentry', {
                data: { id: foodId },
            }).then((response) => {
                deleteData(foodId)
                close()
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
            <DialogTitle id="form-dialog-title">{CONSTANTS.DELETE_FOOD_ENTRY}</DialogTitle>
            <DialogContent>
                Are you sure you want to delete this item?
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
                    onClick={deleteFoodWithCalories} color="secondary" variant="outlined">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteFoodEntry;
