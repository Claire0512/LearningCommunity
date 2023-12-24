'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		primary: {
			main: '#104b76',
		},
		secondary: {
			main: '#44bdea',
		},
		background: {
			default: '#F0F0F0',
		},
		text: {
			primary: '#000000',
			secondary: 'rgba(0, 0, 0, 0.54)',
			disabled: 'rgba(0, 0, 0, 0.38)',
		},
	},
	typography: {
		fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
	},
});
