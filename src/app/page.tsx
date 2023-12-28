'use client';

import React from 'react';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Bar from '../components/AppBar';
import { Card, CardContent, Typography, CardMedia,  Fab , useTheme} from '@mui/material';
import Box from '@mui/material/Box';

import { useSession } from 'next-auth/react';                                              
const cardData = [
	{
		title: '討論專區',
		description:
			'在這裡你可以透過回答別人的問題獲得點數，還有使用點數發問！',
		buttonText: '新建你的第一份菜單',
		image: '/images/1.png',
		link: '/menus-management/menus',
	},
	{
		title: '學習資源',
		description:
			'在這裡你可以看到各式各樣知識分享行文章，透過分類找到喜歡的文章，或是分享文章來獲得點數吧！',
		buttonText: '開始管理你的訂單',
		image: '/images/2.png',
		link: '/orders-management/incoming-orders',
	},
	{
		title: '個人檔案',
		description: '在這裡可以編輯你的個人資訊，還有查看你發布和收藏的問題以及文章，還有歷史總獲得讚數、愛心等相關資訊哦！',
		buttonText: '看看本月表現如何吧',
		image: '/images/3.png',
		link: '/operations-management/basic-information',
	},
];

export default function Home() {
	const theme = useTheme();
	const { data: session } = useSession();
	return (
		<Box component="main" className="flex min-h-full flex-col ">
			<Bar activeButton="首頁" />

			<Box className="mt-[60px] flex flex-1 flex-col items-center">
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
					<Box className="mt-16 flex h-full w-full justify-between ">
						{cardData.map((card, index) => (
							<Card
								key={index}
								className="relative mx-5 mb-1 h-[267px] flex-1 bg-[#FEFDFA]"
								sx={{
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
								>
									<CardMedia
										component="img"
										sx={{
											width: '120px',
											height: '120px',
											position: 'absolute',
											top: 150,
											right: 10,
										}}
										image={card.image}
										alt={card.title}
									/>
								</Box>
								<CardContent>
									<Typography
										gutterBottom
										variant="h5"
										component="div"
										className="font-black"
									>
										{card.title}
									</Typography>
									{card.description.split('\n').map((line, index) => (
										<Typography
											key={index}
											variant="body2"
											color="text.secondary"
											component="div"
											className="mt-1 font-bold"
										>
											{line}
										</Typography>
									))}
								</CardContent>
							</Card>
						))}
					</Box>
				</Box>
			</Box>
			<Fab
					color="secondary"
					aria-label="我要簽到"
					style={{
						position: 'fixed',
						bottom: 20,
						right: 20,
						backgroundColor: `${theme.palette.secondary.main} !important`,
					}}
				>
					<EventAvailableIcon />
				</Fab>
		</Box>
	);
}
