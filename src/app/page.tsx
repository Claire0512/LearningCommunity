'use client';

import React from 'react';

import Bar from '../components/AppBar';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import Box from '@mui/material/Box';

const cardData = [
	{
		title: '討論專區',
		description:
			'概覽：在營業前，速覽一下菜單吧\n菜單：可新增菜單或編輯訂單\n品項控管：管理販售中以及暫停販售的品項',
		buttonText: '新建你的第一份菜單',
		image: '/images/1.png',
		link: '/menus-management/menus',
	},
	{
		title: '學習資源',
		description:
			'新訂單：選擇是否接受訂單\n進行中：可以延時或者取消訂單\n等待取餐：餐點準備完成\n已完成：可察看歷史訂單',
		buttonText: '開始管理你的訂單',
		image: '/images/2.png',
		link: '/orders-management/incoming-orders',
	},
	{
		title: '個人檔案',
		description: '在這裡可以編輯你的個人資訊，還有查看你發布和收藏的問題以及文章哦！',
		buttonText: '看看本月表現如何吧',
		image: '/images/3.png',
		link: '/operations-management/basic-information',
	},
];

export default function Home() {
	return (
		<Box component="main" className="flex min-h-full flex-col bg-[#EFF3FB]">
			<Bar activeButton="首頁" />

			<Box className="mt-[100px] flex flex-1 flex-col items-center">
				<Box
					sx={{
						height: '75%',
						width: '100%',
						overflow: 'visible',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: 15,
					}}
				>
					<Box className="mt-16 flex h-full w-full justify-between ">
						{cardData.map((card, index) => (
							<Card
								key={index}
								className="relative mx-3 mb-1 h-[267px] flex-1 bg-[#F7F9FD]"
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
											width: '150px',
											height: '150px',
											position: 'absolute',
											top: 120,
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
		</Box>
	);
}
