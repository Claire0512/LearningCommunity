'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TextField, Button, Card, CardContent, Snackbar, Alert } from '@mui/material';
import Box from '@mui/material/Box';

import logIn from '@/endpoints/users/login';
import signUp from '@/endpoints/users/signup';

type AlertColor = 'success' | 'info' | 'warning' | 'error';

function Page() {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('info');
	const router = useRouter();
	const commonTextClass = 'text-base';

	const showSnackbar = (message: string, severity: AlertColor) => {
		setSnackbarMessage(message);
		setSnackbarSeverity(severity);
		setSnackbarOpen(true);
	};

	const handleSignUp = async () => {
		if (password !== confirmPassword) {
			showSnackbar('Passwords do not match', 'error');
			return;
		}

		if (password.length < 8) {
			showSnackbar('Password must be at least 8 characters long', 'error');
			return;
		}

		const success = await signUp(email, username, password);
		if (!success) {
			showSnackbar('User already exists', 'error');
			return;
		}

		const loginSuccess = await logIn(email, password);
		if (!loginSuccess) {
			return;
		}
		showSnackbar('Sign up success!', 'success');
		router.push('/');
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await handleSignUp();
	};

	return (
		<Box className="flex h-screen w-screen justify-center bg-white">
			<Card
				className={`flex w-1/3  flex-col ${commonTextClass} rounded-none border-0`}
				elevation={0}
			>
				<CardContent>
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
						<Image src="/images/logo.png" alt="Logo" width={100} height={100} />
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
							label="電子郵件信箱"
							variant="outlined"
							type="email"
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setEmail(e.target.value)
							}
						/>

						<TextField
							className={`mb-4 w-full ${commonTextClass}`}
							label="使用者名稱"
							variant="outlined"
							type="username"
							value={username}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setUsername(e.target.value)
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
						<TextField
							className={`mb-4 w-full ${commonTextClass}`}
							label="再次確認密碼"
							variant="outlined"
							type="password"
							value={confirmPassword}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setConfirmPassword(e.target.value)
							}
						/>
						<Button
							className={`mb-4 h-14 w-full bg-[#104b76] text-white ${commonTextClass}`}
							type="submit"
							variant="contained"
							sx={{ mt: 2, bgcolor: '#35A996' }}
						>
							註冊
						</Button>
						<Button
							className={`${commonTextClass} w-full`}
							sx={{ color: '#104b76' }}
							onClick={() => router.push('/')}
						>
							回到登入介面
						</Button>
					</form>
				</CardContent>
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={6000}
					onClose={() => setSnackbarOpen(false)}
				>
					<Alert
						onClose={() => setSnackbarOpen(false)}
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
