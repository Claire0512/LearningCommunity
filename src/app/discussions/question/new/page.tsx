'use client';

import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import TagsSelector from '../../../../components/TagsSelector';
import { addNewQuestion } from '../../../../lib/api/discussions/apiEndpoints';
import { getAllTags } from '../../../../lib/api/tags/apiEndpoints';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { Card, CardContent, Typography, TextField, Dialog, useTheme } from '@mui/material';
import { Avatar, Chip, Stack, Box } from '@mui/material';

function Page() {
	const theme = useTheme();
	const [tags, setTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const { data: session } = useSession();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();
	const handleSave = (selected: string[]) => {
		setSelectedTags(selected);
		handleCloseModal();
		console.log('Selected tags:', selected);
	};
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	// const session?.user.username = 'Claire';
	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};
	useEffect(() => {
		const fetchTags = async () => {
			try {
				const fetchedTags = await getAllTags();
				setTags(fetchedTags); // Assuming fetchedTags is an array of Tag objects
			} catch (error) {
				console.error('Failed to fetch tags:', error);
			}
		};

		fetchTags();
	}, []);
	const handleContentChange = (event: ChangeEvent<HTMLInputElement>) => {
		setContent(event.target.value);
	};
	const handleSubmit = async () => {
		if (!title || !content) {
			alert('標題和內文不能為空！');
			return;
		}

		// Assuming the user ID is available in the session object
		const questionerId = session?.user.userId;

		const newQuestion = {
			questionTitle: title,
			questionContext: content,
			questionerId: questionerId,
			tags: selectedTags,
			// Add 'questionImage' if you are handling images
		};

		try {
			await addNewQuestion(newQuestion);
			// Handle success, e.g., show a success message or redirect
			alert('問題已成功提交！');
			// Optionally reset form fields
			setTitle('');
			setContent('');
			setSelectedTags([]);
			router.push('/discussions');
		} catch (error) {
			console.error('添加問題失敗:', error);
			// Handle errors, e.g., show an error message
			alert('提交問題時出現錯誤！');
		}
	};

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
				href="/discussions"
				style={{
					position: 'absolute',
					top: '-30px',
					left: '-130px',
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
					width: '100%',
					height: 'auto',
					m: 2,
					display: 'flex',
					flexDirection: 'column',
					borderRadius: '20px',
					backgroundColor: '#FEFDFA',
					position: 'relative',
					margin: 'auto',
					mt: '30px',
				}}
			>
				<CardContent sx={{ flex: '1 0 auto' }}>
					<Stack
						direction="row"
						spacing={2}
						alignItems="center"
						sx={{ flexWrap: 'wrap', overflow: 'hidden', paddingBottom: '10px' }}
					>
						<Avatar alt={session?.user.name} src="" />
						<Typography variant="subtitle1" component="div">
							{session?.user.name}
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
						color="secondary"
						onClick={handleSubmit}
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
