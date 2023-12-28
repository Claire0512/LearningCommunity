import React, { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Card, CardContent, Typography, Avatar, Chip, Stack, Box } from '@mui/material';

import type { QuestionCardType } from '@/lib/types';

function getTimeDifference(createdAt: string) {
	const questionDate = new Date(createdAt).getTime();
	const now = new Date().getTime();
	const differenceInMilliseconds = now - questionDate;

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

function QuestionCard(question: QuestionCardType) {
	const [visibleTags, setVisibleTags] = useState<string[]>(question.tags);
	const tagContainerRef = useRef<HTMLDivElement>(null);
	const formattedTime = getTimeDifference(question.createdAt);
	const router = useRouter();
	useEffect(() => {
		const updateVisibleTags = () => {
			const container = tagContainerRef.current;
			if (container) {
				const visibleWidth = container.offsetWidth;
				let accumulatedWidth = 0;
				const newVisibleTags: string[] = [];

				question.tags.forEach((tag) => {
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
	}, [question.tags]);
	const handleCardClick = () => {
		router.push(`/discussions/question/${question.questionId}`);
	};
	return (
		<Card
			onClick={handleCardClick}
			sx={{
				minWidth: 360,
				maxWidth: 360,
				m: 2,
				display: 'flex',
				flexDirection: 'column',
				borderRadius: '5px',
				backgroundColor: '#F7F9FD',
				position: 'relative',
				'&::before': {
					content: '""',
					position: 'absolute',
					left: 0,
					top: 0,
					bottom: 0,
					width: '15px',
					backgroundColor: question.isSolved ? '#C0EDCA' : '#EDC0C0',
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
					<Avatar alt={question.questionerName} src={question.profilePicture} />
					<Typography variant="subtitle1" component="div" noWrap>
						{question.questionerName}
					</Typography>
					<Typography variant="body2" sx={{ marginLeft: 1 }}>
						{formattedTime}
					</Typography>
				</Stack>
				<Typography variant="h6" component="div" noWrap sx={{ paddingTop: '5px' }}>
					{question.questionTitle}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						lineHeight: '20px',
						height: '30px',
						paddingLeft: '1px',
						paddingTop: '5px',
					}}
				>
					{question.questionContext}
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
				<FavoriteIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{question.upvotes}</Typography>

				<CommentIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{question.commentsCount}</Typography>
				<BookmarkIcon sx={{ color: (theme) => theme.palette.text.secondary }} />
				<Typography variant="body2">{question.favorites}</Typography>
			</Stack>
		</Card>
	);
}

export default QuestionCard;
