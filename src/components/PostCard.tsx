import React, { useState, useEffect, useRef } from 'react';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Card, CardContent, Typography, Avatar, Chip, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { PostCardType } from '@/lib/types';

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

function PostCard(post: PostCardType) {
	const [visibleTags, setVisibleTags] = useState<string[]>(post.tags);
	const tagContainerRef = useRef<HTMLDivElement>(null);
	const theme = useTheme();
	const formattedTime = getTimeDifference(post.createdAt);
	// console.log("post.tags", post.tags);
	useEffect(() => {
		const updateVisibleTags = () => {
			const container = tagContainerRef.current;
			if (container) {
				let visibleWidth = container.offsetWidth;
				let accumulatedWidth = 0;
				const newVisibleTags: string[] = [];

				post.tags.forEach((tag) => {
					const tagElement = container.querySelector(
						`[data-tag="${tag}"]`,
					) as HTMLElement;
					if (tagElement) {
						const tagWidth = tagElement.offsetWidth;
						accumulatedWidth += tagWidth + 2;
						if (accumulatedWidth <= visibleWidth) {
							newVisibleTags.push(tag);
						}
					}
				});

				setVisibleTags(newVisibleTags);
			}
		};

		window.addEventListener('resize', updateVisibleTags);
		updateVisibleTags();

		return () => {
			window.removeEventListener('resize', updateVisibleTags);
		};
	}, [post.tags]);

	return (
		<Card
			sx={{
				minWidth: 360,
				maxWidth: 360,
				m: 2,
				display: 'flex',
				flexDirection: 'column',
				borderRadius: '5px',
				backgroundColor: '#FCFAF5',
				position: 'relative',
				'&::before': {
					content: '""',
					position: 'absolute',
					left: 0,
					top: 0,
					bottom: 0,
					width: '15px',
					backgroundColor: theme.palette.secondary.main,
				},
			}}
		>
			<CardContent sx={{ flex: '1 0 auto', paddingLeft: '30px' }}>
				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
					sx={{ flexWrap: 'nowrap', overflow: 'hidden' }}
				>
					<Avatar alt={post.posterName} src={post.profilePicture} />
					<Typography
						variant="subtitle1"
						component="div"
						noWrap
						sx={{ paddingTop: '5px' }}
					>
						{post.posterName}
					</Typography>
					<Typography variant="body2" sx={{ marginLeft: 1 }}>
						{formattedTime}
					</Typography>
				</Stack>
				<Typography variant="h6" component="div" noWrap>
					{post.postTitle}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						display: '-webkit-box',
						WebkitLineClamp: 1,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						lineHeight: '20px',
						height: '30px',
						paddingLeft: '1px',
						paddingTop: '5px',
					}}
				>
					{post.postContext}
				</Typography>
				<Box
					ref={tagContainerRef}
					sx={{ display: 'flex', gap: 0.5, overflow: 'hidden', paddingTop: '10px' }}
				>
					{visibleTags.map((tag) => (
						<Chip key={tag} label={tag} size="small" data-tag={tag} />
					))}
				</Box>
			</CardContent>
			<Stack
				direction="row"
				spacing={1}
				alignItems="center"
				sx={{ p: 2, pl: 4, pt: 0, mt: 'auto' }}
			>
				<ThumbUpAltIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{post.upvotes}</Typography>
				<ThumbDownAltIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{post.downvotes}</Typography>
				<CommentIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{post.commentsCount}</Typography>
				<BookmarkIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{post.favorites}</Typography>
			</Stack>
		</Card>
	);
}

export default PostCard;
