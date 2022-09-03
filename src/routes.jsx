import React, { Suspense } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";


const FoodEntryComponent = React.lazy(() => import('./components/foodentry/index'));
const DashboardComponent = React.lazy(() => import('./components/admin/Dashboard'));
const GenericNotFound = React.lazy(() => import('./components/GenericNotFound'));

const allRoutes = (props) => {
    const {user} = props;
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<h1>Loading....</h1>}>
                    <Routes>
                        <Route path="/" element={<FoodEntryComponent />} />
                        {user && user.isAdmin && <Route path="/dashboard" element={<DashboardComponent />} />}
                        <Route path='*' element={<GenericNotFound />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )
}

export default allRoutes;
