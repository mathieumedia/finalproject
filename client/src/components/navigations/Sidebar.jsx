import {useState} from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import {Link} from 'react-router-dom'

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const CustomLink = styled(Link)(({theme}) => ({
    textDecoration: 'none',
    color: theme.palette.text.primary
}))

export default function Header(props) {
    const theme = useTheme();

    const {
        open, handleDrawerClose
    } = props

    const [openAdmin, setOpenAdmin] = useState(false)
    const handleClick = () => {
        setOpenAdmin(!openAdmin);
    };

    return (

        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon color='primary' /> : <ChevronRightIcon color='primary' />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                
                >
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <AdminPanelSettingsIcon color='primary'/>
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                    {openAdmin ? <ExpandLess color='primary'/> : <ExpandMore color='primary'/>}
                </ListItemButton>

                <Collapse in={openAdmin} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <CustomLink to={'/hr/employees'}>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <BadgeIcon color='primary'/>
                                </ListItemIcon>
                                <ListItemText primary="Employees" />
                            </ListItemButton>
                        </CustomLink>
                    </List>
                </Collapse>
            </List>
        </Drawer>
    );
}