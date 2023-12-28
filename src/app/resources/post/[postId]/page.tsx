'use client';

import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

import getTimeDifference from '../../../../components/getTimeDifference';
import {
	getPostDetail,
	addCommentToPost,
	addReplyToComment,
	interactWithPost,
	interactiWithPostComment,
} from '../../../../lib/api/resources/apiEndpoints';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { Button, TextField } from '@mui/material';
import {
	useTheme,
	Card,
	CardContent,
	Typography,
	Avatar,
	Chip,
	Stack,
	Box,
	Divider,
	IconButton,
} from '@mui/material';

import type { PostCardDetailType } from '@/lib/types';

function Page() {
	const theme = useTheme();
	const { postId } = useParams<{ postId: string }>();
	const [post, setPost] = useState<PostCardDetailType | null>(null);

	const [newComment, setNewComment] = useState('');
	const [newReply, setNewReply] = useState<{ [commentId: number]: string }>({});
	const [formattedTime, setFormattedTime] = useState('');
	const { data: session } = useSession();
	const userId = session?.user?.userId;
	const handleCommentChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewComment(event.target.value);
		const postData = await getPostDetail(Number(postId), userId);
		setPost(postData);
	};
	const fetchPostDetail = async () => {
		if (postId) {
			try {
				const postData = await getPostDetail(Number(postId), userId);
				setPost(postData);
				setFormattedTime(getTimeDifference(postData.createdAt));
			} catch (error) {
				console.error('Error fetching post detail:', error);
			}
		}
	};
	const handleReplyChange = async (
		commentId: number,
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setNewReply({ ...newReply, [commentId]: event.target.value });
		const postData = await getPostDetail(Number(postId), userId);
		setPost(postData);
	};
	useEffect(() => {
		const fetchPostDetail = async () => {
			if (postId) {
				try {
					const postData = await getPostDetail(Number(postId), userId);
					setPost(postData);
					setFormattedTime(getTimeDifference(postData.createdAt));
				} catch (error) {
					console.error('Error fetching post detail:', error);
				}
			}
		};
		fetchPostDetail();
	}, [postId]);
	if (!post) {
		return <div>Loading...</div>;
	}
	const handleUpvote = async () => {
		if (!session) {
			alert('登入後才可使用此功能');
			return;
		}
		const actionType = post.hasUpvote ? 'remove_upvote' : 'add_upvote';
		try {
			await interactWithPost(session.user.userId, Number(postId), actionType);
			fetchPostDetail();
		} catch (error) {
			console.error('按讚出錯', error);
		}
	};

	const handleDownvote = async () => {
		if (!session) {
			alert('登入後才可使用此功能');
			return;
		}
		const actionType = post.hasDownvote ? 'remove_downvote' : 'add_downvote';
		try {
			await interactWithPost(session.user.userId, Number(postId), actionType);
			fetchPostDetail();
		} catch (error) {
			console.error('按倒讚出錯', error);
		}
	};

	const handleFavorite = async () => {
		if (!session) {
			alert('登入後才可使用此功能');
			return;
		}
		const actionType = post.hasFavorite ? 'remove_favorite' : 'add_favorite';
		try {
			await interactWithPost(session.user.userId, Number(postId), actionType);
			fetchPostDetail();
		} catch (error) {
			console.error('收藏出錯', error);
		}
	};

	const handleSubmitComment = async () => {
		if (!session) {
			alert('登入後才可留言哦');
			return;
		}
		if (!newComment.trim()) {
			alert('評論不能為空');
			return;
		}

		try {
			await addCommentToPost(Number(postId), session.user.userId, newComment);
			alert('評論成功添加！');
			setNewComment('');
			await fetchPostDetail();
		} catch (error) {
			console.error('添加評論失敗', error);
		}
	};

	const handleSubmitReply = async (commentId: number) => {
		if (!session) {
			alert('登入後才可回覆哦');
			return;
		}
		const replyText = newReply[commentId];
		if (!replyText.trim()) {
			alert('回覆不能為空');
			return;
		}

		try {
			await addReplyToComment(commentId, session.user.userId, replyText);
			alert('回覆成功添加！');
			setNewReply({ ...newReply, [commentId]: '' });
			await fetchPostDetail();
		} catch (error) {
			console.error('添加回覆失敗', error);
		}
	};
	const handleCommentUpvote = async (commentId: number) => {
		if (!session) {
			alert('登入後才可使用此功能');
			return;
		}

		const actionType = post.comments.find((c) => c.commentId === commentId)?.hasUpvote
			? 'remove_upvote'
			: 'add_upvote';

		try {
			await interactiWithPostComment(session.user.userId, commentId, actionType);
			await fetchPostDetail();
		} catch (error) {
			console.error('按讚出错', error);
		}
	};

	const handleCommentDownvote = async (commentId: number) => {
		if (!session) {
			alert('登入後才可使用此功能');
			return;
		}

		const actionType = post.comments.find((c) => c.commentId === commentId)?.hasDownvote
			? 'remove_downvote'
			: 'add_downvote';

		try {
			await interactiWithPostComment(session.user.userId, commentId, actionType);
			await fetchPostDetail();
		} catch (error) {
			console.error('按倒讚出错', error);
		}
	};

	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				justifyContent: 'center',
				width: '80%',
			}}
		>
			<a
				href="/resources"
				style={{
					position: 'absolute',
					top: '-30px',
					left: '-30px',
					margin: '10px',
					zIndex: 1000,
					textDecoration: 'none',
					color: 'inherit',
					fontSize: '40px',
				}}
			>
				<ArrowBackIcon style={{ fontSize: 'inherit' }} />
			</a>
			<Card
				sx={{
					width: '80%',
					height: 'auto',
					m: 2,
					display: 'flex',
					flexDirection: 'column',
					borderRadius: '20px',
					backgroundColor: '#FEFDFA',
					position: 'relative',
				}}
			>
				<CardContent sx={{ flex: '1 0 auto', paddingBottom: '0px' }}>
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
						sx={{ flexWrap: 'wrap', overflow: 'hidden' }}
					>
						<Avatar
							alt={post.posterName}
							src={post.profilePicture ? post.profilePicture : ''}
						/>
						<Typography variant="subtitle1" component="div">
							{post.posterName}
						</Typography>
						<Typography variant="body2" sx={{ marginLeft: 1 }}>
							{formattedTime}
						</Typography>
					</Stack>
					<Typography
						variant="h4"
						component="div"
						sx={{ marginTop: '10px', marginLeft: '5px' }}
					>
						{post.postTitle}
					</Typography>

					<Stack direction="row" spacing={1} alignItems="center">
						<IconButton
							onClick={handleUpvote}
							color={post.hasUpvote ? 'secondary' : 'default'}
						>
							<ThumbUpAltIcon />
						</IconButton>
						<Typography variant="body2">{post.upvotes}</Typography>
						<IconButton
							onClick={handleDownvote}
							color={post.hasDownvote ? 'secondary' : 'default'}
						>
							<ThumbDownAltIcon />
						</IconButton>
						<Typography variant="body2">{post.downvotes}</Typography>
						<IconButton
							color={post.hasComment ? 'secondary' : 'default'}
						>
							<CommentIcon />
						</IconButton>
						<Typography variant="body2">{post.commentsCount}</Typography>
						<IconButton
							onClick={handleFavorite}
							color={post.hasFavorite ? 'secondary' : 'default'}
						>
							<BookmarkIcon />
						</IconButton>
						<Typography variant="body2">{post.favorites}</Typography>
					</Stack>
					<Divider
						sx={{
							borderWidth: 1,
							borderStyle: 'solid',
							borderRadius: '2px',
							bgcolor: theme.palette.background.default,
							my: 1,
						}}
					/>

					<Typography
						variant="body1"
						color="text.main"
						component="div"
						sx={{
							lineHeight: '30px',
							fontSize: '22px',
							marginLeft: '10px',
						}}
					>
						{post.postContext}
					</Typography>
					<Box
						sx={{
							display: 'flex',
							gap: 0.5,
							overflow: 'hidden',
							flexWrap: 'wrap',
							paddingLeft: '0px',
							marginLeft: '10px',
							marginTop: '10px',
						}}
					>
						{post.tags.map((tag) => (
							<Chip key={tag} label={tag} size="medium" data-tag={tag} />
						))}
					</Box>
				</CardContent>

				<CardContent sx={{ paddingTop: '5px' }}>
					<List sx={{ borderRadius: '30px' }}>
						{post.comments.map((comment, index) => (
							<React.Fragment key={comment.commentId}>
								{index >= 0 && <Divider />}
								<ListItem alignItems="flex-start">
									<ListItemAvatar>
										<Avatar
											alt={comment.commenterName}
											src={
												comment.commenterProfilePicture
													? comment.commenterProfilePicture
													: ''
											}
										/>
									</ListItemAvatar>
									<ListItemText
										primary={comment.commenterName}
										secondary={comment.text}
										primaryTypographyProps={{ variant: 'body1' }}
										secondaryTypographyProps={{
											variant: 'body2',
											color: 'text.secondary',
											sx: { wordBreak: 'break-word' },
										}}
									/>
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
										sx={{ marginLeft: 'auto', minWidth: '100px' }}
									>
										<IconButton
											onClick={() => handleCommentUpvote(comment.commentId)}
											color={comment.hasUpvote ? 'secondary' : 'default'}
										>
											<ThumbUpAltIcon />
										</IconButton>
										<Typography variant="body2">{comment.upvotes}</Typography>
										<IconButton
											onClick={() => handleCommentDownvote(comment.commentId)}
											color={comment.hasDownvote ? 'secondary' : 'default'}
										>
											<ThumbDownAltIcon />
										</IconButton>
										<Typography variant="body2">{comment.downvotes}</Typography>
									</Stack>
								</ListItem>

								{comment.replies &&
									comment.replies.map((reply, replyIndex) => (
										<React.Fragment key={reply.commentId}>
											{replyIndex >= 0 && (
												<Divider variant="inset" component="li" />
											)}
											<ListItem alignItems="flex-start" sx={{ pl: 4 }}>
												<ListItemAvatar>
													<Avatar
														alt={reply.commenterName}
														src={
															reply.commenterProfilePicture
																? reply.commenterProfilePicture
																: ''
														}
													/>
												</ListItemAvatar>
												<ListItemText
													primary={reply.commenterName}
													secondary={reply.text}
													primaryTypographyProps={{ variant: 'body1' }}
													secondaryTypographyProps={{
														variant: 'body2',
														color: 'text.secondary',
														sx: { wordBreak: 'break-word' },
													}}
												/>
												<Stack
													direction="row"
													alignItems="center"
													spacing={1}
													sx={{ marginLeft: 'auto', minWidth: '100px' }}
												>
													<IconButton
														onClick={() =>
															handleCommentUpvote(reply.commentId)
														}
														color={
															reply.hasUpvote
																? 'secondary'
																: 'default'
														}
													>
														<ThumbUpAltIcon />
													</IconButton>
													<Typography variant="body2">
														{reply.upvotes}
													</Typography>
													<IconButton
														onClick={() =>
															handleCommentDownvote(reply.commentId)
														}
														color={
															reply.hasDownvote
																? 'secondary'
																: 'default'
														}
													>
														<ThumbDownAltIcon />
													</IconButton>
													<Typography variant="body2">
														{reply.downvotes}
													</Typography>
												</Stack>
											</ListItem>
										</React.Fragment>
									))}
								{
									<ListItem>
										<ListItemText>
											<Stack
												direction="row"
												spacing={1}
												alignItems="center"
												sx={{ pl: 4 }}
											>
												<TextField
													fullWidth
													variant="outlined"
													label="Add a reply"
													value={newReply[comment.commentId] || ''}
													onChange={(e) =>
														handleReplyChange(
															comment.commentId,
															e as ChangeEvent<HTMLInputElement>,
														)
													}
													color="secondary"
													sx={{
														'& .MuiOutlinedInput-root': {
															borderRadius: '20px',
														},
													}}
												/>

												<Button
													variant="contained"
													onClick={() =>
														handleSubmitReply(comment.commentId)
													}
													sx={{
														mt: 2,
														bgcolor: `${theme.palette.secondary.main} !important`,
														height: '40px',
														borderRadius: '20px',
													}}
													color="secondary"
												>
													Submit
												</Button>
											</Stack>
										</ListItemText>
									</ListItem>
								}
							</React.Fragment>
						))}
						<Divider />

						{
							<ListItem>
								<ListItemText>
									<Stack direction="row" spacing={1} alignItems="center">
										<TextField
											fullWidth
											variant="outlined"
											label="Add a comment"
											value={newComment}
											onChange={handleCommentChange}
											color="secondary"
											sx={{
												'& .MuiOutlinedInput-root': {
													borderRadius: '20px',
													'& fieldset': {
														borderRadius: '20px',
													},
												},
											}}
										/>

										<Button
											variant="contained"
											onClick={handleSubmitComment}
											sx={{
												mt: 2,
												bgcolor: `${theme.palette.secondary.main} !important`,
												height: '40px',
												borderRadius: '20px',
											}}
											color="secondary"
										>
											Submit
										</Button>
									</Stack>
								</ListItemText>
							</ListItem>
						}
					</List>
				</CardContent>
			</Card>
		</div>
	);
}

export default Page;