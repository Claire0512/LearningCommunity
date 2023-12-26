'use client';

import React, { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

const sampleNotification = [
	{
		userId: 123,
		replierId: 123,
		replierName: 'Enip',
		postTitle: 'hi',
		questionTitle: null,
		isRead: false,
		createdAt: '2023 11 05 19:00',
		NotificationId: 123,
		postId: 123,
		questionId: null,
	},
	{
		userId: 123,
		replierId: 123,
		replierName: 'Enip',
		postTitle: 'hi',
		questionTitle: null,
		isRead: false,
		createdAt: '2023 11 05 18:00',
		NotificationId: 123,
		postId: 123,
		questionId: null,
	},
	{
		userId: 123,
		replierId: 123,
		replierName: 'Enip',
		postTitle: 'hi',
		questionTitle: null,
		isRead: true,
		createdAt: '2023 11 05 19:00',
		NotificationId: 123,
		postId: 123,
		questionId: null,
	},
	{
		userId: 123,
		replierId: 123,
		replierName: 'Enip',
		postTitle: 'hi',
		questionTitle: null,
		isRead: false,
		createdAt: '2023 11 05 19:00',
		NotificationId: 123,
		postId: 123,
		questionId: null,
	},
	{
		userId: 123,
		replierId: 123,
		replierName: 'Enip',
		postTitle: 'hi',
		questionTitle: null,
		isRead: false,
		createdAt: '2023 11 05 18:00',
		NotificationId: 123,
		postId: 123,
		questionId: null,
	},
	{
		userId: 123,
		replierId: 123,
		replierName: 'Enip',
		postTitle: 'hi',
		questionTitle: null,
		isRead: true,
		createdAt: '2023 11 05 19:00',
		NotificationId: 123,
		postId: 123,
		questionId: null,
	},
	{
		userId: 123,
		replierId: 123,
		replierName: 'Enip',
		postTitle: 'hi',
		questionTitle: null,
		isRead: false,
		createdAt: '2023 11 05 19:00',
		NotificationId: 123,
		postId: 123,
		questionId: null,
	},
	{
		userId: 123,
		replierId: 123,
		replierName: 'Enip',
		postTitle: 'hi',
		questionTitle: null,
		isRead: false,
		createdAt: '2023 11 05 18:00',
		NotificationId: 123,
		postId: 123,
		questionId: null,
	},
	{
		userId: 123,
		replierId: 123,
		replierName: 'Enip',
		postTitle: 'hi',
		questionTitle: null,
		isRead: true,
		createdAt: '2023 11 05 19:00',
		NotificationId: 123,
		postId: 123,
		questionId: null,
	},
];
function getTimeDifference(createdAt: string) {
	const postDate = new Date(createdAt).getTime();
	const now = new Date().getTime();
	const differenceInMilliseconds = now - postDate;

	const minutes = Math.floor(differenceInMilliseconds / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (minutes < 60) {
		return `${minutes} 分鐘前`;
	} else if (hours < 24) {
		return `${hours} 小時前`;
	} else {
		return `${days} 天前`;
	}
}
function renderNotification(notification) {
	const formattedTime = formatNotificationTime(notification.createdAt);
	const href = notification.postId
		? `/resources/post/${notification.postId}`
		: `/discussion/question/${notification.questionId}`;
	const textContent = notification.postId
		? `${notification.replierName} 於 ${formattedTime} 回應了你的文章「${notification.postTitle}」`
		: `${notification.replierName} 於 ${formattedTime} 回應了你的問題「${notification.questionTitle}」`;

	return (
		<div
			key={notification.NotificationId}
			style={{ display: 'flex', alignItems: 'center', margin: '10px' }}
		>
			<span
				style={{
					height: '10px',
					width: '10px',
					borderRadius: '50%',
					backgroundColor: notification.isRead ? 'white' : '#BFD1ED',
					marginRight: '5px',
				}}
			></span>
			<Link href={href} passHref>
				<Button
					component="a"
					style={{
						textTransform: 'none',
						justifyContent: 'flex-start',
						fontSize: '16px',
						backgroundColor: 'white',
					}}
				>
					{textContent}
				</Button>
			</Link>
		</div>
	);
}

function formatNotificationTime(createdAt: string) {
	return getTimeDifference(createdAt);
}

export default function Bar({ activeButton }: { activeButton: string }) {
	const theme = useTheme();
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

	// Check for unread notifications
	useEffect(() => {
		setHasUnreadNotifications(sampleNotification.some((notification) => !notification.isRead));
	}, [sampleNotification]);

	// Close the notifications dropdown
	const handleCloseNotifications = () => {
		setIsNotificationsOpen(false);
	};
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
				<Image src="/images/logo.png" alt="Logo" width={80} height={80} />
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
						marginLeft: '40px',
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

					<Button
						style={{
							fontSize: '26px',
							color: activeButton === '通知' ? '#104b76' : '#000000',
							position: 'relative', // Position the red dot absolutely inside the button
						}}
						onClick={() => setIsNotificationsOpen((prev) => !prev)}
					>
						通知
						{hasUnreadNotifications && (
							<span
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									height: '10px',
									width: '10px',
									borderRadius: '50%',
									backgroundColor: 'red',
									transform: 'translate(-50%, -50%)',
								}}
							/>
						)}
					</Button>

					{isNotificationsOpen && (
						<ClickAwayListener onClickAway={handleCloseNotifications}>
							<div
								style={{
									position: 'absolute',
									top: '130px',
									right: '140px',
									width: '300px',
									backgroundColor: 'white',
									boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
									maxHeight: '300px',
									overflowY: 'scroll',
									zIndex: 1000,
								}}
							>
								{sampleNotification.map((notification) =>
									renderNotification(notification),
								)}
							</div>
						</ClickAwayListener>
					)}

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
