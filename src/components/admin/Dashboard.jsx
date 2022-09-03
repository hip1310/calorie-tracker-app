import * as React from 'react';
import { useEffect } from 'react'
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import { axiosAPI } from '../../services';
import Navigation from '../Navigation';
import { CONSTANTS } from '../../utils/constants';

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

const DashboardComponent = () => {
    const [reportData, setReportData] = React.useState({})
    const [userData, setUserData] = React.useState([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    useEffect(() => {
        getReportData()
    }, []);

    const handleChangeRowsPerPage = (
        event
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userData.length) : 0;

    const getReportData = async () => {
        // api call for fetching reports data
        try {
            const response = await axiosAPI.get('/admin/get-reports-data')
            setReportData(response.data.data)
            setUserData(response.data.data.averageData);
        } catch (e) {
            console.error(e)
        }
    }

    const handleChangePage = (
        event,
        newPage,
    ) => {
        setPage(newPage);
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <>
            <Navigation />
            <Box sx={{ width: '100%', marginTop: 10 }}>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Item>
                            <Typography variant="h4" gutterBottom component="div">
                                Number of Entries(Last 7 Days)
                            </Typography>
                            <Typography variant="h5" gutterBottom component="div">
                                {reportData.last7daysEntries}
                            </Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                            <Typography variant="h4" gutterBottom component="div">
                                Number of Entries(Previous Week)
                            </Typography>
                            <Typography variant="h5" gutterBottom component="div">
                                {reportData.previousWeekCount}
                            </Typography>
                        </Item>
                    </Grid>

                    <Typography mt={2} ml={5} align='center' variant="h4" component="h2">
                        {CONSTANTS.AVG_CALORIES}
                    </Typography>

                    <Table sx={{ minWidth: 500, margin: 5 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>User</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }} align="right">Total Calories</TableCell>                         </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? userData && userData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : userData
                            ).map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell component="th" scope="row">
                                        {row._id.name}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {row.calories}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        {userData.length > 0 && <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={userData.length}
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
                </Grid>
            </Box>
        </>
    );
}

export default DashboardComponent;
