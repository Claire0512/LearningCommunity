import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Provider from '@/app/context/client-provider';
import { theme } from '@/theme/Theme';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
	icons: {
		icon: '/favicon.ico',
	},
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions);

	return (
		<html lang="en">
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Provider session={session}>
					<body className={`h-screen ${inter.className}`}>{children}</body>
				</Provider>
			</ThemeProvider>
		</html>
	);
}
