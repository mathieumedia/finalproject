import {
    BrowserRouter as Router, Routes, Route
} from 'react-router-dom'
import {  useSettings } from './hooks/customHooks';
import { ThemeProvider } from '@mui/material/styles';
import {lightTheme} from './themes/lightTheme'
import {darkTheme} from './themes/darkTheme'

import Login from './pages/Login'
import Register from './pages/Register'

import EmployeeMain from './pages/employees/EmployeeMain'
import EmployeeSearch from './pages/employees/EmployeeSearch'
import Showroom from './pages/sales/Showroom';
import VehiclePurchase from './pages/sales/VehiclePurchase';
import VehicleProfile from './pages/sales/VehicleProfile';
import Service from './pages/service/Service';

function App() {
    const {currentTheme} = useSettings()
    
    return (
        <ThemeProvider theme={currentTheme === 'light' ? lightTheme : currentTheme === 'dark' ? darkTheme : null}> 
            <Router>
                <Routes>
                    <Route path='/' element={<EmployeeSearch />} />
                    <Route path='/sales/showroom' element={<Showroom />} />
                    <Route path='/sales/vehicleprofile/:id' element={<VehicleProfile />} />
                    <Route path='/sales/purchase/:id' element={<VehiclePurchase  />} />

                    <Route path='/service' element={<Service />} />

                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    <Route path='/hr/employees' element={<EmployeeSearch  />} />
                    <Route path='/hr/employees/profile/:employeeId' element={<EmployeeMain  />} />
                </Routes>
                
            </Router>
            
        </ThemeProvider>
    );
}
export default App