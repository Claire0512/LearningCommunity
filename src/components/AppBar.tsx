'use client';

import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import { getNotifications } from '../lib/api/users/apiEndpoints';
import type { NotificationType } from '../lib/types';
import MailIcon from '@mui/icons-material/Mail';
import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import logOut from '@/lib/api/authentication/logout';

import getTimeDifference from './getTimeDifference';

function renderNotification(notification: NotificationType) {
	console.log(notification);
	const formattedTime = formatNotificationTime(notification.createdAt);
	const href = notification.postId
		? `/resources/post/${notification.postId}`
		: `/discussions/question/${notification.questionId}`;
	const textContent = notification.postId
		? `${notification.lastNotifyUsername} 於 ${formattedTime} 回應了你的文章「${notification.postTitle}」`
		: `${notification.lastNotifyUsername} 於 ${formattedTime} 回應了你的問題「${notification.questionTitle}」`;

	return (
		<div
			key={notification.notificationId}
			style={{ display: 'flex', alignItems: 'center', margin: '10px' }}
		>
			<span
				style={{
					height: '10px',
					width: '10px',
					borderRadius: '50%',
					backgroundColor: notification.isRead ? 'white' : '#BFD1ED',
					marginRight: '5px',
					marginLeft: '5px',
					flexShrink: 0,
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

						transition: 'background-color 0.3s',
					}}
					onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
					onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
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
	const { data: session } = useSession();
	const theme = useTheme();
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
	const [notifications, setNotifications] = useState<NotificationType[]>([]);
	const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

	useEffect(() => {
		const userId = session?.user.userId;
		if (userId) {
			getNotifications(userId)
				.then((data) => {
					setNotifications(data);
					setHasUnreadNotifications(
						data.some((notification: NotificationType) => !notification.isRead),
					);
					setUnreadNotificationsCount(
						data.filter((notification: NotificationType) => !notification.isRead)
							.length,
					);
				})
				.catch((error) => {
					console.error('Error fetching notifications:', error);
				});
		}
	}, [session]);

	const handleCloseNotifications = () => {
		setIsNotificationsOpen(false);
	};
	const handleClick = (event: React.SyntheticEvent, type: string) => {
		if (!session) {
			window.alert(`登入後才可查看${type === 'profile' ? '個人檔案' : '通知'}哦！`);
			event.preventDefault();
		} else {
			if (type === 'notifications') {
				setIsNotificationsOpen((prev) => !prev);
			}
		}
	};
	const handleLogout = async () => {
		if (window.confirm('確定要登出嗎？')) {
			await logOut();
		}
	};
	return (
		<AppBar sx={{ height: '80px', bgcolor: `${theme.palette.secondary.main} !important` }}>
			<Toolbar
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					height: '80px',
				}}
			>
				<Image src="/images/logo.png" alt="Logo" width={50} height={50} />
				<p
					style={{
						fontWeight: 'bold',
						color: '#104b76',
						fontSize: '26px',
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
								fontSize: '20px',
								color: activeButton === '首頁' ? '#104b76' : '#000000',
							}}
						>
							首頁
						</Button>
					</Link>
					<Link href="/discussions" passHref>
						<Button
							style={{
								fontSize: '20px',
								color: activeButton === '討論專區' ? '#104b76' : '#000000',
							}}
						>
							討論專區
						</Button>
					</Link>
					<Link href="/resources" passHref>
						<Button
							style={{
								fontSize: '20px',
								color: activeButton === '學習資源' ? '#104b76' : '#000000',
							}}
						>
							學習資源
						</Button>
					</Link>
					<Link href="/profile" passHref>
						<Button
							style={{
								fontSize: '20px',
								color: activeButton === '個人檔案' ? '#104b76' : '#000000',
							}}
							onClick={(e) => handleClick(e, 'profile')}
						>
							個人檔案
						</Button>
					</Link>

					<Button
						style={{
							fontSize: '20px',
							color: activeButton === '通知' ? '#104b76' : '#000000',
							position: 'relative',
						}}
						onClick={(e) => handleClick(e, 'notifications')}
					>
						<Badge
							badgeContent={unreadNotificationsCount}
							color="primary"
							max={99}
							sx={{
								'.MuiBadge-badge': {
									height: '15px',
									width: '15px',
									minWidth: '15px',
									fontSize: '0.6em',
									top: '10%',
									right: '-10%',
								},
							}}
						>
							通知
						</Badge>
					</Button>

					{isNotificationsOpen && (
						<ClickAwayListener onClickAway={handleCloseNotifications}>
							<div
								style={{
									position: 'absolute',
									top: '100px',
									right: '140px',
									width: '300px',
									backgroundColor: 'white',
									boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
									maxHeight: '400px',
									overflowY: 'scroll',
									zIndex: 1000,
								}}
							>
								{notifications.map((notification) =>
									renderNotification(notification),
								)}
							</div>
						</ClickAwayListener>
					)}

					{session ? (
						<Button
							style={{
								fontSize: '20px',
								color: activeButton === '登出' ? '#104b76' : '#000000',
							}}
							onClick={handleLogout}
						>
							登出
						</Button>
					) : (
						<Link href="/sign-in" passHref>
							<Button
								style={{
									fontSize: '20px',
									color: activeButton === '登入/註冊' ? '#104b76' : '#000000',
								}}
							>
								登入/註冊
							</Button>
						</Link>
					)}
				</div>
			</Toolbar>
		</AppBar>
	);
}
