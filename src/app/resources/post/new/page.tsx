'use client';

import React, { useState, ChangeEvent } from 'react';

import TagsSelector from '../../../../components/TagsSelector';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { Card, CardContent, Typography, TextField, Dialog, useTheme } from '@mui/material';
import { Avatar, Chip, Stack, Box } from '@mui/material';

interface Tag {
	id: number;
	name: string;
}
interface SelectedTag extends Tag {
	category: string;
}
const sampleTags = {
	grades: [
		{ id: 1, name: 'Grade 1' },
		{ id: 2, name: 'Grade 2' },
	],
	subjects: [
		{ id: 101, name: 'Mathematics' },
		{ id: 102, name: 'Science' },
	],
	others: [
		{ id: 201, name: 'Homework Help' },
		{ id: 202, name: 'Exam Prep' },
	],
};
function Page() {
	const theme = useTheme();
	const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleSave = (selected: SelectedTag[]) => {
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
	const handleSubmit = () => {
		if (!title || !content) {
			alert('標題和內文不能為空！');
			return;
		}

		console.log('送出資料', { title, content, selectedTags });
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
								key={tag.id}
								label={
									<Typography style={{ fontSize: '16px' }}>{tag.name}</Typography>
								}
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
				<TagsSelector tags={sampleTags} onSave={handleSave} onCancel={handleCloseModal} />
			</Dialog>
		</div>
	);
}

export default Page;
