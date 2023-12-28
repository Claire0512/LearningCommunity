'use client';

import React, { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { ExpandableSection } from '../../components/ExpandableSection';
import PostCard from '../../components/PostCard';
import QuestionCard from '../../components/QuestionCard';
import {
	getUserPosts,
	getUserFavoritePosts,
	getUserQuestions,
	getUserFavoriteQuestions,
	updateUserInfo,
	getUserInfo,
} from '../../lib/api/users/apiEndpoints';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Button } from '@mui/material';
import { Card, CardContent, Typography, TextField, Dialog, useTheme } from '@mui/material';
import { Avatar, Stack, Box } from '@mui/material';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';

import type { PostCardType, QuestionCardType, NewUserInfoType, UserInfoType } from '@/lib/types';

function Page() {
	const theme = useTheme();
	const { data: session } = useSession();
	const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

	const [openDialog, setOpenDialog] = useState(false);
	const [newName, setNewName] = useState('');
	const [newProfilePicture, setNewProfilePicture] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
	const [userPosts, setUserPosts] = useState<PostCardType[]>([]);
	const [userFavoritePosts, setUserFavoritePosts] = useState<PostCardType[]>([]);

	const [userQuestions, setUserQuestions] = useState<QuestionCardType[]>([]);

	const [userFavoriteQuestions, setUserFavoriteQuestions] = useState<QuestionCardType[]>([]);

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};
	useEffect(() => {
		const fetchData = async () => {
			try {
				const userId = session?.user?.userId;
				const posts = await getUserPosts(userId);
				const favoritePosts = await getUserFavoritePosts(userId);
				const questions = await getUserQuestions(userId);
				const favoriteQuestions = await getUserFavoriteQuestions(userId);
				const userInfoData = await getUserInfo(userId);
				setUserInfo(userInfoData);
				setUserPosts(posts);
				setUserFavoritePosts(favoritePosts);
				setUserQuestions(questions);
				setUserFavoriteQuestions(favoriteQuestions);
				setNewName(userInfoData?.name);
				setNewProfilePicture(userInfoData?.profilePicture || '');
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [session?.user.userId]);
	const handleSave = async () => {
		if (!userInfo) return;
		if (!newName.trim() || !currentPassword.trim()) {
			alert('名字和當前密碼不能為空！');
			return;
		}
		if (newPassword && newPassword !== newPasswordConfirm) {
			alert('新密碼和確認密碼不匹配！');
			return;
		}

		const newUserInfo: NewUserInfoType = {
			userId: userInfo.userId,
			newName,
			newProfilePicture,
			currentPassword,
			newPassword,
		};

		try {
			await updateUserInfo(newUserInfo);
			handleCloseDialog();
		} catch (error) {
			alert('Failed to update user information');
		}
	};
	console.log(userInfo);
	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: '90%',
			}}
		>
			<Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
				使用者資訊
			</Typography>
			{userInfo && (
				<Card
					sx={{
						width: '45%',
						height: 'auto',
						m: 2,
						display: 'flex',
						borderRadius: '10px',
						backgroundColor: '#FEFDFA',
						position: 'relative',
						margin: 'auto',
					}}
				>
					<Box
						sx={{
							width: '40%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							ml: '35px',
							mr: '10px',
						}}
					>
						<Avatar
							alt={userInfo.name}
							src={userInfo.profilePicture || ''}
							sx={{ width: 70, height: 70 }}
						/>
					</Box>
					<CardContent sx={{ flex: '1 0 auto', width: '40%', marginTop: '10px' }}>
						<Typography variant="h6" component="div">
							{userInfo.name}
						</Typography>
						<Stack direction="row" spacing={1} alignItems="center">
							<FavoriteIcon color="error" /> <span>{userInfo.hearts}</span>
							<ThumbUpIcon color="primary" /> <span>{userInfo.upvotes}</span>
							<ThumbDownIcon color="error" /> <span>{userInfo.downvotes}</span>
							<BookmarkIcon color="primary" /> <span>{userInfo.favorites}</span>
							<CheckCircleIcon color="success" /> <span>{userInfo.checkmarks}</span>
						</Stack>
					</CardContent>
					<Box sx={{ p: 5, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
						<Button
							variant="contained"
							color="secondary"
							onClick={handleOpenDialog}
							sx={{
								mt: 2,
								ml: 1,
								bgcolor: `${theme.palette.secondary.main} !important`,
								height: '40px',
								borderRadius: '20px',
							}}
						>
							編輯
						</Button>
					</Box>
				</Card>
			)}
			<Dialog open={openDialog} onClose={handleCloseDialog} sx={{ borderRadius: '10px', backgroundColor:'#FEFDFA' }}>
				<DialogTitle sx={{ textAlign: 'center' }}>編輯個人資料</DialogTitle>
				<DialogContent>
					<Stack spacing={3} className="mt-[10px]">
						<TextField
							autoFocus
							margin="dense"
							label="新名字"
							type="text"
							fullWidth
							variant="outlined"
							value={newName}
							color="secondary"
							onChange={(e) => setNewName(e.target.value)}
						/>
						<TextField
							margin="dense"
							label="新頭像 URL (選填)"
							type="text"
							fullWidth
							variant="outlined"
							value={newProfilePicture}
							color="secondary"
							onChange={(e) => setNewProfilePicture(e.target.value)}
						/>
						<TextField
							margin="dense"
							label="當前密碼"
							type="password"
							fullWidth
							variant="outlined"
							value={currentPassword}
							color="secondary"
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>
						<TextField
							margin="dense"
							label="新密碼 (選填)"
							type="password"
							fullWidth
							variant="outlined"
							value={newPassword}
							color="secondary"
							onChange={(e) => setNewPassword(e.target.value)}
						/>
						<TextField
							margin="dense"
							label="再次確認新密碼 (選填)"
							type="password"
							fullWidth
							variant="outlined"
							color="secondary"
							value={newPasswordConfirm}
							onChange={(e) => setNewPasswordConfirm(e.target.value)}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCloseDialog}
						variant="contained"
						color="secondary"
						sx={{
							mt: 2,
							ml: 1,
							mb: 1,
							bgcolor: `${theme.palette.secondary.main} !important`,
							height: '40px',
							borderRadius: '20px',
						}}
					>
						取消
					</Button>
					<Button
						onClick={handleSave}
						variant="contained"
						color="secondary"
						sx={{
							mt: 2,
							ml: 1,
							mb: 1,
							bgcolor: `${theme.palette.secondary.main} !important`,
							height: '40px',
							borderRadius: '20px',
						}}
					>
						儲存
					</Button>
				</DialogActions>
			</Dialog>
			<ExpandableSection
				title="發佈的問題"
				items={userQuestions}
				renderQuestionItem={(question) => (
					<QuestionCard key={question.questionId} {...question} />
				)}
			/>
			<ExpandableSection
				title="發佈的文章"
				items={userPosts}
				renderPostItem={(post) => <PostCard key={post.postId} {...post} />}
			/>

			<ExpandableSection
				title="收藏的問題"
				items={userFavoriteQuestions}
				renderQuestionItem={(question) => (
					<QuestionCard key={question.questionId} {...question} />
				)}
			/>

			<ExpandableSection
				title="收藏的文章"
				items={userFavoritePosts}
				renderPostItem={(post) => <PostCard key={post.postId} {...post} />}
			/>
		</div>
	);
}

export default Page;
