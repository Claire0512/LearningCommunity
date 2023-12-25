import React, { useState, useEffect, useRef } from 'react';

import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Card, CardContent, Typography, Avatar, Chip, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { PostCardType } from '@/lib/types';

function PostCard(post: PostCardType) {
	const [visibleTags, setVisibleTags] = useState<string[]>(post.tags);
	const tagContainerRef = useRef<HTMLDivElement>(null);
	const theme = useTheme();
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
						accumulatedWidth += tagWidth + 1;
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
				borderRadius: '20px',
				backgroundColor: '#FCFAF5',
			}}
		>
			<CardContent sx={{ flex: '1 0 auto' }}>
				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
					sx={{ flexWrap: 'nowrap', overflow: 'hidden' }}
				>
					<Avatar alt={post.posterName} src={post.profilePicture} />
					<Typography variant="subtitle1" component="div" noWrap>
						{post.posterName}
					</Typography>
					<Box
						ref={tagContainerRef}
						sx={{ display: 'flex', gap: 0.5, overflow: 'hidden' }}
					>
						{visibleTags.map((tag) => (
							<Chip key={tag} label={tag} size="small" data-tag={tag} />
						))}
					</Box>
				</Stack>
				<Typography variant="h6" component="div" noWrap>
					{post.postTitle}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						display: '-webkit-box',
						WebkitLineClamp: 3,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						lineHeight: '20px', // Adjust this value based on your design
						height: '60px', // This should be 3 times the line height
					}}
				>
					{post.postContext}
				</Typography>
			</CardContent>
			<Stack direction="row" spacing={1} alignItems="center" sx={{ p: 2, pt: 0, mt: 'auto' }}>
				<ThumbUpAltIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{post.upvotes}</Typography>
				<ThumbDownAltIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{post.downvotes}</Typography>
				<CommentIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{post.commentsCount}</Typography>
				<FavoriteIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{post.favorites}</Typography>
			</Stack>
		</Card>
	);
}

export default PostCard;
