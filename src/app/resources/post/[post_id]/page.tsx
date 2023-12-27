'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

import getTimeDifference from '../../../../components/getTimeDifference';
import { getPostDetail } from '../../../../lib/api/resources/apiEndpoints';
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
	const { postId } = useParams<{ postId: string }>(); // 獲取 URL 中的 postId 參數
	const [post, setPost] = useState<PostCardDetailType | null>(null); // 儲存帖子詳情

	const [newComment, setNewComment] = useState('');
	const [newReply, setNewReply] = useState<{ [commentId: number]: string }>({});
	const [formattedTime, setFormattedTime] = useState('');

	const { data: session } = useSession();
	const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewComment(event.target.value);
	};

	const handleReplyChange = (commentId: number, event: React.ChangeEvent<HTMLInputElement>) => {
		setNewReply({ ...newReply, [commentId]: event.target.value });
	};
	useEffect(() => {
		// 加載帖子詳情
		const fetchPostDetail = async () => {
			if (postId) {
				try {
					const postData = await getPostDetail(Number(postId));
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
	const [upvoted, setUpvoted] = useState(false);
	const [downvoted, setDownvoted] = useState(false);

	const [favorited, setFavorited] = useState(false);

	const handleUpvote = () => {
		if (!session) {
			alert('登入後才可使用此功能');
			return;
		}
		setUpvoted(!upvoted);
	};

	const handleDownvote = () => {
		if (!session) {
			alert('登入後才可使用此功能');
			return;
		}
		setDownvoted(!downvoted);
	};

	const handleFavorite = () => {
		if (!session) {
			alert('登入後才可使用此功能');
			return;
		}
		setFavorited(!favorited);
	};

	const handleSubmitComment = () => {
		if (!session) {
			alert('登入後才可留言哦');
			return;
		}
	};

	const handleSubmitReply = (commentId: number) => {
		if (!session) {
			alert('登入後才可留言哦');
			return;
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
					backgroundColor: '#FCFAF5',
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
						<Avatar alt={post.posterName} src={post.profilePicture} />
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
							color={upvoted ? 'secondary' : 'default'}
						>
							<ThumbUpAltIcon />
						</IconButton>
						<Typography variant="body2">{post.upvotes}</Typography>
						<IconButton
							onClick={handleDownvote}
							color={downvoted ? 'secondary' : 'default'}
						>
							<ThumbDownAltIcon />
						</IconButton>
						<Typography variant="body2">{post.downvotes}</Typography>
						<IconButton>
							<CommentIcon />
						</IconButton>
						<Typography variant="body2">{post.commentsCount}</Typography>
						<IconButton
							onClick={handleFavorite}
							color={favorited ? 'secondary' : 'default'}
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
											src={comment.commenterProfilePicture}
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
								</ListItem>

								{comment.replies &&
									comment.replies.map((reply, replyIndex) => (
										<React.Fragment key={reply.commentId}>
											{replyIndex >= 0 && (
												<Divider variant="inset" component="li" />
											)}
											<ListItem alignItems="flex-start" sx={{ ml: 4 }}>
												<ListItemAvatar>
													<Avatar
														alt={reply.commenterName}
														src={reply.commenterProfilePicture}
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
												sx={{ ml: 4 }}
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
