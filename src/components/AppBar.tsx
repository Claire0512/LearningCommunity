import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

export default function Bar({ activeButton }: { activeButton: string }) {
	const theme = useTheme();
	return (
		<AppBar sx={{ height: '130px', bgcolor: `${theme.palette.secondary.main} !important` }}>
			<Toolbar
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					height: '130px',
				}}
			>
				<Image src="/images/logo.png" alt="Logo" width={100} height={100} />
				<p
					style={{
						fontWeight: 'bold',
						color: '#104b76',
						fontSize: '32px',
						marginLeft: '20px',
					}}
				>
					學習互助平台
				</p>
				<div
					style={{
						marginLeft: 'auto',
						display: 'flex',
						flexGrow: 1,
						justifyContent: 'space-around',
					}}
				>
					<Link href="/" passHref>
						<Button
							style={{
								fontSize: '26px',
								color: activeButton === '首頁' ? '#104b76' : '#000000',
							}}
						>
							首頁
						</Button>
					</Link>
					<Link href="/discussions" passHref>
						<Button
							style={{
								fontSize: '26px',
								color: activeButton === '討論專區' ? '#104b76' : '#000000',
							}}
						>
							討論專區
						</Button>
					</Link>
					<Link href="/resources" passHref>
						<Button
							style={{
								fontSize: '26px',
								color: activeButton === '學習資源' ? '#104b76' : '#000000',
							}}
						>
							學習資源
						</Button>
					</Link>
					<Link href="/profile" passHref>
						<Button
							style={{
								fontSize: '26px',
								color: activeButton === '個人檔案' ? '#104b76' : '#000000',
							}}
						>
							個人檔案
						</Button>
					</Link>
					<Link href="/sign-in" passHref>
						<Button
							style={{
								fontSize: '26px',
								color: activeButton === '登入/註冊' ? '#104b76' : '#000000',
							}}
						>
							登入/註冊
						</Button>
					</Link>
				</div>
			</Toolbar>
		</AppBar>
	);
}
