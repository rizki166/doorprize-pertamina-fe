import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        {/* Logo atau Judul */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Doorprize 🎁
        </Typography>

        {/* Menu untuk Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Button color="inherit">Motor</Button>
          <Button color="inherit">Emas</Button>
          <Button color="inherit">Kulkas</Button>
        </Box>

        {/* Menu Hamburger untuk Mobile */}
        <IconButton 
          edge="end" 
          color="inherit" 
          aria-label="menu" 
          onClick={handleMenuOpen}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Dropdown Menu untuk Mobile */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuClose}>Motor</MenuItem>
          <MenuItem onClick={handleMenuClose}>Emas</MenuItem>
          <MenuItem onClick={handleMenuClose}>Kulkas</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
