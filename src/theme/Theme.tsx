'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		primary: {
			main: '#104b76',
			light: '#527da3',
			dark: '#000000',
		},
		secondary: {
			main: '#BFD1ED',
		},
		background: {
			default: '#FCFAF5',
		},
		text: {
			primary: '#24282D',
			secondary: 'rgba(0, 0, 0, 0.54)',
			disabled: 'rgba(0, 0, 0, 0.38)',
		},
	},
	typography: {
		fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
	},
	components: {
		// Name of the component
		MuiButton: {
			styleOverrides: {
				// Name of the slot
				root: {
					// Some CSS
					backgroundColor: '#BFD1ED',
				},
			},
		},
	},
});
