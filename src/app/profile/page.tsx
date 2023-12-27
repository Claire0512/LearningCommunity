'use client';

import React, { useState } from 'react';

import { ExpandableSection } from '../../components/ExpandableSection';
import PostCard from '../../components/PostCard';
import QuestionCard from '../../components/QuestionCard';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Button } from '@mui/material';
import { Card, CardContent, Typography, TextField, Dialog, useTheme } from '@mui/material';
import { Avatar, Stack, Box } from '@mui/material';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { PostCardType, QuestionCardType } from '@/lib/types';

const sampleUser = {
	userName: 'Claire',
	userId: 123,
	profilePicture: 'url/to/profile/picture2.jpg',
	points: 1000,
	hearts: 150,
	upvotes: 200,
	downvotes: 50,
	favorites: 75,
	checkmarks: 5,
	email: '1@gmail.com',
};

const sampleUserPosts = [
	{
		postId: 456,
		postTitle: 'Delicious Recipes',
		postContext: 'Sharing my favorite homemade recipes.',
		posterId: 123,
		posterName: 'Claire',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 300,
		downvotes: 20,
		commentsCount: 30,
		favorites: 75,
		tags: ['food', 'recipes', 'cooking'],
		createdAt: '2023 11 05 19:00',
	},
];
const sampleFavoritePosts = [
	{
		postId: 456,
		postTitle: 'Delicious Recipes',
		postContext: 'Sharing my favorite homemade recipes.',
		posterId: 123,
		posterName: 'Claire',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 300,
		downvotes: 20,
		commentsCount: 30,
		favorites: 75,
		tags: ['food', 'recipes', 'cooking'],
		createdAt: '2023 11 05 19:00',
	},
];
const sampleUserQuestions = [
	{
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 458,
		questionTitle: 'Traveling Tips Needed',
		questionContext: 'Looking for budget traveling tips.',
		questionerId: 123,
		questionerName: 'user123',
		profilePicture: 'url/to/profile/picture2.jpg',
		upvotes: 250,
		commentsCount: 40,
		isSolved: true,
		tags: ['travel', 'budget', 'advice'],
	},
	{
		favorites: 101,
		createdAt: '2023 11 05 19:00',
		questionId: 458,
		questionTitle: 'Traveling Tips Needed',
		questionContext: 'Looking for budget traveling tips.',
		questionerId: 123,
		questionerName: 'user123',
		profilePicture: 'url/to/profile/picture2.jpg',
		upvotes: 250,
		commentsCount: 40,
		isSolved: true,
		tags: ['travel', 'budget', 'advice'],
	},
	{
		favorites: 102,
		createdAt: '2023 11 05 19:00',
		questionId: 458,
		questionTitle: 'Traveling Tips Needed',
		questionContext: 'Looking for budget traveling tips.',
		questionerId: 123,
		questionerName: 'user123',
		profilePicture: 'url/to/profile/picture2.jpg',
		upvotes: 250,
		commentsCount: 40,
		isSolved: true,
		tags: ['travel', 'budget', 'advice'],
	},
	{
		favorites: 103,
		createdAt: '2023 11 05 19:00',
		questionId: 458,
		questionTitle: 'Traveling Tips Needed',
		questionContext: 'Looking for budget traveling tips.',
		questionerId: 123,
		questionerName: 'user123',
		profilePicture: 'url/to/profile/picture2.jpg',
		upvotes: 250,
		commentsCount: 40,
		isSolved: true,
		tags: ['travel', 'budget', 'advice'],
	},
];

const sampleFavoriteQuestions = [
	{
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 458,
		questionTitle: 'Traveling Tips Needed',
		questionContext: 'Looking for budget traveling tips.',
		questionerId: 123,
		questionerName: 'user123',
		profilePicture: 'url/to/profile/picture2.jpg',
		upvotes: 250,
		commentsCount: 40,
		isSolved: true,
		tags: ['travel', 'budget', 'advice'],
	},
];

function updateUserInfo(userId, newName, newProfilePicture, currentPassword, newPassword) {
	return true;
}
function Page() {
	const theme = useTheme();
	const [userPostsIsExpanded, setUserPostsIsExpanded] = useState(false);

	const handleToggleExpand = () => {
		setUserPostsIsExpanded(!userPostsIsExpanded);
	};
	const handleSubmit = () => {};
	const [openDialog, setOpenDialog] = useState(false);
	const [newName, setNewName] = useState(sampleUser.userName);
	const [newProfilePicture, setNewProfilePicture] = useState(sampleUser.profilePicture);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleSave = () => {
		if (!newName.trim() || !currentPassword.trim()) {
			alert('名字和當前密碼不能為空！');
			return;
		}
		if (newPassword && newPassword !== newPasswordConfirm) {
			alert('新密碼和確認密碼不匹配！');
			return;
		}

		const updateSuccess = updateUserInfo(
			sampleUser.userId,
			newName,
			newProfilePicture,
			currentPassword,
			newPassword,
		);
		if (!updateSuccess) {
			alert('密碼錯誤');
			return;
		}

		handleCloseDialog();
	};
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
			<Card
				sx={{
					width: '45%',
					height: 'auto',
					m: 2,
					display: 'flex',
					borderRadius: '10px',
					backgroundColor: '#FCFAF5',
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
						alt={sampleUser.userName}
						src={sampleUser.profilePicture}
						sx={{ width: 70, height: 70 }}
					/>
				</Box>
				<CardContent sx={{ flex: '1 0 auto', width: '40%', marginTop: '10px' }}>
					<Typography variant="h6" component="div">
						{sampleUser.userName}
					</Typography>
					<Typography variant="body1" component="div" sx={{ marginBottom: '5px' }}>
						{sampleUser.email}
					</Typography>
					<Stack direction="row" spacing={1} alignItems="center">
						<FavoriteIcon color="error" /> <span>{sampleUser.hearts}</span>
						<ThumbUpIcon color="primary" /> <span>{sampleUser.upvotes}</span>
						<ThumbDownIcon color="error" /> <span>{sampleUser.downvotes}</span>
						<BookmarkIcon color="primary" /> <span>{sampleUser.favorites}</span>
						<CheckCircleIcon color="success" /> <span>{sampleUser.checkmarks}</span>
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
							height: '40px', // Adjust the height as needed
							borderRadius: '20px',
						}}
					>
						編輯
					</Button>
				</Box>
			</Card>

			<Dialog open={openDialog} onClose={handleCloseDialog} sx={{ borderRadius: '10px' }}>
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
				items={sampleUserQuestions}
				renderItem={(question: QuestionCardType) => (
					<QuestionCard key={question.questionId} {...question} />
				)}
			/>

			<ExpandableSection
				title="發佈的文章"
				items={sampleUserPosts}
				renderItem={(post: PostCardType) => <PostCard key={post.postId} {...post} />}
			/>

			<ExpandableSection
				title="收藏的問題"
				items={sampleFavoriteQuestions}
				renderItem={(question: QuestionCardType) => (
					<QuestionCard key={question.questionId} {...question} />
				)}
			/>

			<ExpandableSection
				title="收藏的文章"
				items={sampleFavoritePosts}
				renderItem={(post: PostCardType) => <PostCard key={post.postId} {...post} />}
			/>
		</div>
	);
}

export default Page;
