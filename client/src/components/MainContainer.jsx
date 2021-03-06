import {useState} from 'react';
import {
    Box, CssBaseline, styled,
} from '@mui/material';

// import {useAuth} from '../hooks/customHooks';

import Header from './navigations/Header';
import Sidebar from './navigations/Sidebar';
import Copyright from './Copyright';
const drawerWidth = 240;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    
    ({ theme, open }) => ({
        height: '100vh',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
        }),
        marginBottom: 6
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));



export default function MainContainer(props) {
    // const authContext = useAuth();

    // useEffect(() => {
    //     authContext.loadUser();
    //     // eslint-disable-next-line
    // },[])
    const [open, setOpen] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        
        <Box sx={{ display: 'flex'}}>
            <CssBaseline />

            <Header open={open} handleDrawerOpen={handleDrawerOpen} title={props.title}/>
            <Sidebar open={open} handleDrawerClose={handleDrawerClose} />

            <Main open={open}>
                <DrawerHeader />
                    {props.children}
                <Copyright />
            </Main>
            <Box sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                //textAlign: 'center',
                pb: 3,
                pt:3,
                backgroundColor: 'inherit'
            }}>
                {/* <Copyright /> */}
            </Box>
        </Box>
    )
}

