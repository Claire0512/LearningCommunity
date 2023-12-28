'use client';

import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import TagsSelector from '../../../../components/TagsSelector';
import { addNewPost } from '../../../../lib/api/resources/apiEndpoints';
import { getAllTags } from '../../../../lib/api/tags/apiEndpoints';
import type { NewPostType } from '../../../../lib/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
	Button,
	Card,
	CardContent,
	Typography,
	TextField,
	Dialog,
	Avatar,
	Chip,
	Stack,
	Box,
	useTheme,
} from '@mui/material';

function Page() {
	const theme = useTheme();
	const router = useRouter();
	const { data: session } = useSession();
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleSave = (selected: string[]) => {
		setSelectedTags(selected);
		handleCloseModal();
		console.log('Selected tags:', selected);
	};
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	const posterName = 'Claire';
	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};

	const handleContentChange = (event: ChangeEvent<HTMLInputElement>) => {
		setContent(event.target.value);
	};
	const handleSubmit = async () => {
		if (!title || !content) {
			alert('標題和內文不能為空！');
			return;
		}

		const posterId = session?.user.userId;
		console.log('posterId:', posterId);
		const newPost: NewPostType = {
			postTitle: title,
			postContext: content,
			tags: selectedTags,
			posterId: posterId,
		};

		try {
			console.log(newPost);
			await addNewPost(newPost);
			alert('文章發布成功！');
			setTitle('');
			setContent('');
			setSelectedTags([]);
			router.push('/resources');
		} catch (error) {
			console.error('Error submitting post:', error);
			alert('發布文章失敗，請重試。');
		}
	};
	useEffect(() => {
		const fetchTags = async () => {
			try {
				const fetchedTags = await getAllTags();
				setTags(fetchedTags);
			} catch (error) {
				console.error('Error fetching tags:', error);
			}
		};
		fetchTags();
	}, []);
	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				justifyContent: 'center',
				width: '60%',
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
					margin: 'auto',
				}}
			>
				<CardContent sx={{ flex: '1 0 auto' }}>
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
						sx={{ flexWrap: 'wrap', overflow: 'hidden', paddingBottom: '10px' }}
					>
						<Avatar alt={posterName} src="" />
						<Typography variant="subtitle1" component="div">
							{posterName}
						</Typography>
					</Stack>
					<TextField
						fullWidth
						label="標題"
						variant="outlined"
						value={title}
						color="secondary"
						onChange={handleTitleChange}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '20px',
								'& fieldset': {
									borderRadius: '20px',
								},
							},
							paddingBottom: '10px',
						}}
					/>

					<TextField
						fullWidth
						label="內文"
						variant="outlined"
						multiline
						value={content}
						color="secondary"
						onChange={handleContentChange}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '20px',
								'& fieldset': {
									borderRadius: '20px',
								},
							},
							paddingBottom: '10px',
						}}
					/>

					<Box display="flex" alignItems="center" gap={1}>
						<Button onClick={handleOpenModal}>
							<Typography variant="body1" style={{ fontSize: '16px' }}>
								{selectedTags.length > 0 ? '所選分類：' : '選擇分類'}
							</Typography>
						</Button>
						{selectedTags.map((tag) => (
							<Chip
								key={tag}
								label={<Typography style={{ fontSize: '16px' }}>{tag}</Typography>}
							/>
						))}
					</Box>
				</CardContent>
				<Box
					sx={{
						p: 2,
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<Button
						variant="contained"
						onClick={handleSubmit}
						color="secondary"
						sx={{
							mt: 2,
							bgcolor: `${theme.palette.secondary.main} !important`,
							height: '40px',
							borderRadius: '20px',
						}}
					>
						送出
					</Button>
				</Box>
			</Card>
			<Dialog open={isModalOpen} onClose={handleCloseModal}>
				<TagsSelector tags={tags} onSave={handleSave} onCancel={handleCloseModal} />
			</Dialog>
		</div>
	);
}

export default Page;
