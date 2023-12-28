'use client';

import React, { useState } from 'react';
import type { SyntheticEvent } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TextField, Button, Card, CardContent, Snackbar, Alert } from '@mui/material';
import Box from '@mui/material/Box';

import logIn from '@/lib/api/authentication/login';

type AlertColor = 'success' | 'info' | 'warning' | 'error';

function Page() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('info');
	const router = useRouter();
	const commonTextClass = 'text-base';

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const loginSuccess = await logIn(email, password);
		if (!loginSuccess) {
			showSnackbar('帳號或密碼錯誤', 'error');
			return;
		}
		showSnackbar('Sign in success!', 'success');
		router.push('/');
	};

	const showSnackbar = (message: string, severity: AlertColor) => {
		setSnackbarMessage(message);
		setSnackbarSeverity(severity);
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (
		event: Event | SyntheticEvent<Element, Event>,
		reason?: string,
	) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackbar(false);
	};
	return (
		<Box className="flex h-screen  w-screen justify-center bg-white">
			<Card
				className={`flex w-1/3  flex-col ${commonTextClass} rounded-none border-0`}
				elevation={0}
			>
				<CardContent>
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
						<Image src="/images/logo.png" alt="Logo" width={120} height={120} />
					</div>
					<p
						style={{
							fontWeight: 'bold',
							color: '#104b76',
							fontSize: '32px',
							textAlign: 'center',
							marginBottom: '20px',
							marginTop: '20px',
						}}
					>
						學習互助平台
					</p>
					<form onSubmit={handleSubmit}>
						<TextField
							className={`mb-4 w-full ${commonTextClass}`}
							label="帳號"
							variant="outlined"
							type="email"
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setEmail(e.target.value)
							}
						/>
						<TextField
							className={`mb-4 w-full ${commonTextClass}`}
							label="密碼"
							variant="outlined"
							type="password"
							value={password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setPassword(e.target.value)
							}
						/>
						<Button
							type="submit"
							className={`mb-4 h-14 w-full bg-[#104b76] text-white ${commonTextClass}`}
							variant="contained"
							style={{ backgroundColor: '#104b76', color: 'white' }}
						>
							登入
						</Button>
					</form>
					<div className={`flex flex-row items-center justify-center ${commonTextClass}`}>
						<span className={`${commonTextClass}`}>還沒註冊嗎？</span>
						<Button
							className={`${commonTextClass} m-2 min-w-0 p-0`}
							sx={{ color: '#104b76' }}
							onClick={() => router.push('/sign-up')}
						>
							註冊
						</Button>
					</div>
				</CardContent>

				<Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
					<Alert
						onClose={handleCloseSnackbar}
						severity={snackbarSeverity}
						sx={{ width: '100%' }}
					>
						{snackbarMessage}
					</Alert>
				</Snackbar>
			</Card>
		</Box>
	);
}

export default Page;
