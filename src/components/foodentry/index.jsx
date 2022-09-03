import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import moment from 'moment';

import { axiosAPI } from '../../services/index';
import AddFoodEntry from './AddFoodEntry';
import EditFoodEntry from './EditFoodEntry';
import DeleteFoodEntry from './DeleteFoodEntry';
import { CONSTANTS } from '../../utils/constants';
import { isAdmin, getUserData } from '../../utils/Utility';
import Navigation from '../Navigation';

const TablePaginationActions = (props) => {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

const FoodEntryComponent = () => {
    const [value, setValue] = React.useState([null, null]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [allFoodEntries, setAllFoodEntries] = React.useState([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [foodId, setFoodId] = useState('');
    const [foodElement, setFoodElement] = useState({});
    const [priceForMonth, setPriceForMonth] = useState()
    const [userFoodData, setUserFoodData] = useState()

    useEffect(() => {
        getUserData().isAdmin ? getAdminFoodEntries() : getAllFoodEntries();
    }, []);

    useEffect(() => {
        getMonthlyPriceTotal()
        getUserFoodData()
    }, [allFoodEntries])

    const getAllFoodEntries = async () => {
        const startDate = moment(value[0]).format('YYYY-MM-DD');
        const endDate = moment(value[1]).format('YYYY-MM-DD');
        let url = 'v1/get-food-entries';
        if (value[0] && value[1])
            url += `?start=${startDate}&end=${endDate}`;
        try {
            const res = await axiosAPI.get(url);
            setAllFoodEntries(res.data.data);
        } catch (e) {
            console.error(e)
        }
    }

    const getAdminFoodEntries = async () => {
        try {
            const res = await axiosAPI.get(`/admin/get-food-entries`);
            setAllFoodEntries(res.data.data);
        } catch (e) {
            console.error(e)
        }
    }

    const getMonthlyPriceTotal = async () => {
        try {
            const res = await axiosAPI.get(`v1/get-monthly-price`);
            setPriceForMonth(res.data.data[0].price);
        } catch (e) {
            console.error(e)
        }
    }

    const getUserFoodData = async () => {
        try {
            const res = await axiosAPI.get(`/v1/get-user-food-data`);
            setUserFoodData(res.data.data)
        } catch (e) {
            console.error(e)
        }
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allFoodEntries.length) : 0;

    const handleChangePage = (
        event,
        newPage,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const closeAddDialog = () => {
        setIsAddOpen(false)
    }

    const openEditDialog = (element) => {
        setFoodElement(element)
        setIsEditOpen(true)
    }
    const closeEditDialog = () => {
        setIsEditOpen(false)
    }

    const openDeleteDialog = (id) => {
        setFoodId(id)
        setIsDeleteOpen(true)
    }

    const closeDeleteDialog = () => {
        setIsDeleteOpen(false)
    }

    const updateAddData = (response) => {
        setIsAddOpen(false)
        setAllFoodEntries([response.data, ...allFoodEntries])
    }

    const updateDeleteData = (response) => {
        setIsDeleteOpen(false)
        const updatedArray = allFoodEntries.filter((element) => element._id !== response)
        setAllFoodEntries(updatedArray)
    }

    const updateEditdata = (data) => {
        const index = allFoodEntries.findIndex(item => item._id === data._id);
        setIsEditOpen(false)
        setAllFoodEntries([...allFoodEntries.slice(0, index),
            data,
        ...allFoodEntries.slice(index + 1)])
    }

    return (
        <>
            <Navigation priceForMonth={priceForMonth} userFoodData={userFoodData} />
            { allFoodEntries && <TableContainer component={Paper}>
                <Typography variant="h5" component="h2">
                    {CONSTANTS.FOOD_ENTRY_LIST}
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'row', margin: 20, justifyContent: 'space-between' }}>
                    <LocalizationProvider style={{ display: 'flex', flex: 50 }} dateAdapter={AdapterDateFns}>
                        <DateRangePicker
                            startText="Start Date"
                            endText="End Date"
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                            renderInput={(startProps, endProps) => (
                                <React.Fragment>
                                    <TextField {...startProps} />
                                    <Box sx={{ mx: 2 }}> to </Box>
                                    <TextField {...endProps} />
                                    <Box sx={{ mx: 2 }}>  </Box>
                                    <Button variant="outlined" onClick={value[0] && value[1] && getAllFoodEntries}>
                                        Apply
                                    </Button>
                                </React.Fragment>
                            )}
                        />

                    </LocalizationProvider>
                    <IconButton onClick={() => setIsAddOpen(true)}>
                        <Button variant="outlined" startIcon={<AddCircleIcon color="primary" />}>
                            Add
                        </Button>
                    </IconButton>
                </div>
                <AddFoodEntry open={isAddOpen} close={closeAddDialog} updatedData={updateAddData} />
                <EditFoodEntry open={isEditOpen} close={closeEditDialog} element={foodElement} editData={updateEditdata}></EditFoodEntry>
                <DeleteFoodEntry open={isDeleteOpen} close={closeDeleteDialog} deleteData={updateDeleteData} foodId={foodId}></DeleteFoodEntry>
                 <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">Calories</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="right">Price</TableCell>
                            {isAdmin() && <TableCell style={{ fontWeight: 'bold' }} align="right">User</TableCell>}
                            <TableCell style={{ fontWeight: 'bold' }} align="right">Date</TableCell>
                            {isAdmin() && <TableCell style={{ fontWeight: 'bold' }} align="right">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? allFoodEntries && allFoodEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : allFoodEntries
                        ).map((row) => (
                            <TableRow key={row._id}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.calories}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.price && `$${row.price}`}
                                </TableCell>
                                {isAdmin() && <TableCell style={{ width: 160 }} align="right">
                                    {row.user && row.user.length > 0 && row.user[0].name}
                                </TableCell>}
                                <TableCell style={{ width: 160 }} align="right">
                                    {moment(row.createdAt).format('MM-DD-YYYY HH:mm ')}
                                </TableCell>
                                {isAdmin() && <TableCell style={{ width: 160 }} align="right">
                                    <IconButton onClick={() => openEditDialog(row)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => openDeleteDialog(row._id)}>
                                        <DeleteIcon color="primary" />
                                    </IconButton>
                                </TableCell>}
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    {allFoodEntries.length > 0 && <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={allFoodEntries.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                    }
                </Table>
                {
                    !allFoodEntries.length > 0 && <span className='no-records'>
                        No Records Found
                    </span>
                }
            </TableContainer>}
        </>
    );
}

export default FoodEntryComponent;
