'use client';

import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import Bar from '../components/AppBar';
import { getUserInfo, dailySign } from '../lib/api/users/apiEndpoints';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Card, CardContent, Typography, CardMedia, Fab, useTheme, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import type { UserInfoType } from '@/lib/types';

const cardData = [
	{
		title: '討論專區 - 互助共成長',
		description:
			'加入討論，豐富知識之旅！在這裡，回答問題不僅能幫助他人，還能賺取點數。有疑問？使用點數提問，讓專家來助你一臂之力！',

		image: '/images/1.png',
	},
	{
		title: '學習資源 - 知識的寶庫',
		description:
			'探索知識的海洋！這裡有各種知識分享型文章，按類別尋找你感興趣的內容，或是分享自己的專業文章來獲得點數！',

		image: '/images/2.png',
	},
	{
		title: '個人檔案 - 你的成長軌跡',
		description:
			'在這裡，你可以編輯個人資訊，追蹤自己發布和收藏的問題與文章。查看你的成就，包括獲得的讚數、愛心等，見證自己的成長！',

		image: '/images/3.png',
	},
];

export default function Home() {
	const theme = useTheme();
	const { data: session } = useSession();
	const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState('');

	const openModal = (content: string) => {
		setModalContent(content);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};
	useEffect(() => {
		if (session) {
			getUserInfo(session.user.userId)
				.then((userInfo) => setUserInfo(userInfo))
				.catch(console.error);
		}
	}, [session]);

	const handleSignInClick = async () => {
		console.log(userInfo);
		if (userInfo?.hasSigned) {
			openModal('你今天已經簽到過了哦！');
		} else {
			try {
				await dailySign(session?.user.userId);
				openModal('簽到成功！獲得點數一點！');
				getUserInfo(session?.user.userId)
					.then((userInfo) => setUserInfo(userInfo))
					.catch(console.error);
			} catch (error) {
				console.error('Error in daily sign:', error);
			}
		}
	};

	return (
		<Box
			component="main"
			sx={{
				display: 'flex',
				minHeight: '100%',
				flexDirection: 'column',
			}}
		>
			<Bar activeButton="首頁" />

			<Box
				sx={{
					mt: '60px',
					display: 'flex',
					flex: 1,
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						height: '80%',
						width: '100%',
						overflow: 'visible',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: 10,
					}}
				>
					<Box
						sx={{
							mt: 10,
							display: 'flex',
							height: '100%',
							width: '100%',
							justifyContent: 'space-between',
						}}
					>
						{cardData.map((card, index) => (
							<Card
								key={index}
								sx={{
									position: 'relative',
									mx: 1.25,
									mb: 0.25,
									height: '200px',
									width: '400px',
									maxWidth: '330px',
									flex: 1,
									backgroundColor: '#FEFDFA',

									overflow: 'visible',
									...(index === 0 && { marginRight: 'auto' }),
									...(index === 1 && { marginX: 'auto' }),
									...(index === 2 && { marginLeft: 'auto' }),
									borderRadius: '10px',
								}}
							>
								<Box
									sx={{
										bgcolor: '#BFD1ED',
										height: '15%',
										position: 'relative',
										borderTopLeftRadius: '10px',
										borderTopRightRadius: '10px',
									}}
								></Box>

								<CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
									<Typography
										gutterBottom
										variant="h6"
										component="div"
										sx={{ alignSelf: 'flex-start', fontWeight: '900' }}
									>
										{card.title}
									</Typography>

									<Box
										sx={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between',
											alignItems: 'center',
											width: '100%',
										}}
									>
										<Box sx={{ flex: '1 1 auto' }}>
											{card.description.split('\n').map((line, index) => (
												<Typography
													key={index}
													variant="body2"
													color="text.secondary"
													component="div"
													sx={{
														fontWeight: 'bold',
													}}
												>
													{line}
												</Typography>
											))}
										</Box>
										<CardMedia
											component="img"
											sx={{
												width: '110px',
												height: '90px',
												alignSelf: 'center',
											}}
											image={card.image}
											alt={card.title}
										/>
									</Box>
								</CardContent>
							</Card>
						))}
					</Box>
				</Box>
			</Box>
			{session && (
				<Fab
					color="secondary"
					aria-label="我要簽到"
					style={{
						position: 'fixed',
						bottom: 20,
						right: 20,
						backgroundColor: userInfo?.hasSigned
							? '#EBEBEB'
							: `${theme.palette.secondary.main} !important`,
					}}
					onClick={handleSignInClick}
				>
					<EventAvailableIcon />
				</Fab>
			)}

			<Dialog
				open={modalOpen}
				onClose={closeModal}
				PaperProps={{ sx: { borderRadius: '10px', backgroundColor: '#FEFDFA' } }}
			>
				<DialogTitle>提示</DialogTitle>
				<DialogContent>
					<DialogContentText>{modalContent}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeModal}>確定</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
