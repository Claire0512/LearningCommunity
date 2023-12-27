'use client';

import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import QuestionCard from '../../components/QuestionCard';
import TagsSelector from '../../components/TagsSelector';
import ArticleIcon from '@mui/icons-material/Article';
import CreateIcon from '@mui/icons-material/Create';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Box, Button, Dialog, TextField, Chip, Typography } from '@mui/material';
import { Fab } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { QuestionCardType } from '@/lib/types';

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
const sampleHotQuestions = [
	{
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 456,
		questionTitle: 'Delicious Recipes Inquiry',
		questionContext: 'Seeking advice on homemade recipes.',
		questionerId: 123,
		questionerName: 'user123',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 300,
		commentsCount: 30,
		isSolved: false,
		tags: ['food', 'recipes', 'cooking'],
	},
	{
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 457,
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

const sampleAllQuestions = [
	{
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 456,
		questionTitle: 'Delicious Recipes Inquiry',
		questionContext: 'Seeking advice on homemade recipes.',
		questionerId: 123,
		questionerName: 'user123',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 300,
		commentsCount: 30,
		isSolved: false,
		tags: ['food', 'recipes', 'cooking'],
	},
	{
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 457,
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
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 459,
		questionTitle: 'Delicious Recipes Inquiry',
		questionContext: 'Seeking advice on homemade recipes.',
		questionerId: 123,
		questionerName: 'user123',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 300,
		commentsCount: 30,
		isSolved: false,
		tags: ['food', 'recipes', 'cooking'],
	},
	{
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 450,
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
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 451,
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
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 452,
		questionTitle: 'Delicious Recipes Inquiry',
		questionContext: 'Seeking advice on homemade recipes.',
		questionerId: 123,
		questionerName: 'user123',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 300,
		commentsCount: 30,
		isSolved: false,
		tags: ['food', 'recipes', 'cooking'],
	},
	{
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 453,
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
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		questionId: 454,
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
interface Tag {
	id: number;
	name: string;
}

interface SelectedTag extends Tag {
	category: string;
}

function Page() {
	const theme = useTheme();
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Define the type of setSelectedTags based on the SelectedTag interface
	const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);
	const [filteredQuestions, setFilteredQuestions] =
		useState<QuestionCardType[]>(sampleAllQuestions);
	const [searchInput, setSearchInput] = useState('');
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	const handleSave = (selected: SelectedTag[]) => {
		setSelectedTags(selected);
		handleCloseModal();
		console.log('Selected tags:', selected);
	};
	const { data: session } = useSession();
	const handleCreateQuestionClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (!session) {
			alert('登入後才可發問哦');
			event.preventDefault();
		}
	};
	useEffect(() => {
		const filterByTags =
			selectedTags.length > 0
				? (question: QuestionCardType) =>
						selectedTags
							.map((tag) => tag.name)
							.every((tagName) => question.tags.includes(tagName))
				: (question: QuestionCardType) => true;

		const filterBySearch = (question: QuestionCardType) =>
			question.questionTitle.toLowerCase().startsWith(searchInput.toLowerCase());

		const newFilteredQuestions = sampleAllQuestions.filter(
			(question: QuestionCardType) => filterByTags(question) && filterBySearch(question),
		);
		setFilteredQuestions(newFilteredQuestions);
	}, [selectedTags, searchInput]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(event.target.value);
	};

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<p
					style={{
						fontWeight: 'bold',
						color: '#000000',
						fontSize: '32px',
						textAlign: 'center',
					}}
				>
					本日熱門問題
				</p>
				<LocalFireDepartmentIcon sx={{ color: 'red', fontSize: '40px', ml: 1 }} />
			</Box>

			<Box
				sx={{
					height: '90%',
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 1,
					width: '100%',
					marginLeft: '50px',
				}}
			>
				{sampleHotQuestions.map((question) => (
					<QuestionCard {...question} />
				))}
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: '30px',
				}}
			>
				<p
					style={{
						fontWeight: 'bold',
						color: '#000000',
						fontSize: '32px',
						textAlign: 'center',
					}}
				>
					所有問題
				</p>
				<ArticleIcon sx={{ color: 'blue', fontSize: '40px', ml: 1 }} />
			</Box>

			<Box display="flex" alignItems="center" gap={1}>
				<Button onClick={handleOpenModal}>
					<Typography variant="body1" style={{ fontSize: '26px' }}>
						{selectedTags.length > 0 ? '所選分類' : '選擇分類'}
					</Typography>
				</Button>
				{selectedTags.map((tag) => (
					<Chip
						key={tag.id}
						label={<Typography style={{ fontSize: '26px' }}>{tag.name}</Typography>}
					/>
				))}
			</Box>

			<Dialog open={isModalOpen} onClose={handleCloseModal}>
				<TagsSelector tags={sampleTags} onSave={handleSave} onCancel={handleCloseModal} />
			</Dialog>
			<TextField
				fullWidth
				placeholder="Search..."
				value={searchInput}
				onChange={handleSearchChange}
				sx={{ mt: 4, mb: 4 }}
			/>
			<Box
				sx={{
					height: '90%',
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 1,
					width: '100%',
					marginLeft: '50px',
				}}
			>
				{filteredQuestions.map((question) => (
					<QuestionCard {...question} />
				))}
			</Box>
			<a
				href="/discussions/question/new"
				style={{ textDecoration: 'none' }}
				onClick={handleCreateQuestionClick}
			>
				<Fab
					color="secondary"
					aria-label="我要發問"
					style={{
						position: 'fixed',
						bottom: 20,
						right: 20,
						backgroundColor: `${theme.palette.secondary.main} !important`,
					}}
				>
					<CreateIcon />
				</Fab>
			</a>
		</>
	);
}

export default Page;
