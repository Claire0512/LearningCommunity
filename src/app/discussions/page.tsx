'use client';

import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import QuestionCard from '../../components/QuestionCard';
import TagsSelector from '../../components/TagsSelector';
import { getAllQuestions, getTop3HotQuestions } from '../../lib/api/discussions/apiEndpoints';
import { getAllTags } from '../../lib/api/tags/apiEndpoints';
import ArticleIcon from '@mui/icons-material/Article';
import CreateIcon from '@mui/icons-material/Create';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Box, Button, Dialog, TextField, Chip, Typography, Fab, useTheme } from '@mui/material';

import type { QuestionCardType } from '@/lib/types';

function Page() {
	const theme = useTheme();
	const { data: session } = useSession();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTags, setSelectedTags] = useState<string[]>([]); // 更新狀態類型
	const [filteredQuestions, setFilteredQuestions] = useState<QuestionCardType[]>([]);
	const [hotQuestions, setHotQuestions] = useState<QuestionCardType[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [searchInput, setSearchInput] = useState('');

	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	const handleSave = (selected: string[]) => {
		setSelectedTags(selected);
		handleCloseModal();
		console.log('Selected tags:', selected);
	};

	const handleCreateQuestionClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (!session) {
			alert('登入後才可發問哦');
			event.preventDefault();
		}
	};

	useEffect(() => {
		const fetchQuestionsAndTags = async () => {
			try {
				const questions = await getAllQuestions();
				const hotQs = await getTop3HotQuestions();
				const fetchedTags = await getAllTags();

				setFilteredQuestions(questions);
				setHotQuestions(hotQs);
				setTags(fetchedTags);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchQuestionsAndTags();
	}, []);

	useEffect(() => {
		const filterByTags =
			selectedTags.length > 0
				? (question: QuestionCardType) =>
						selectedTags.every((tagName) => question.tags.includes(tagName))
				: (question: QuestionCardType) => true;

		const filterBySearch = (question: QuestionCardType) =>
			question.questionTitle.toLowerCase().includes(searchInput.toLowerCase());

		const newFilteredQuestions = filteredQuestions.filter(
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
						color: '#24282D',
						fontSize: '28px',
						textAlign: 'center',
					}}
				>
					本日熱門問題
				</p>
				<LocalFireDepartmentIcon sx={{ color: '#E3A0A0', fontSize: '40px', ml: 1 }} />
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
				{hotQuestions.map((question) => (
					<QuestionCard key={question.questionId} {...question} />
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
						color: '#24282D',
						fontSize: '28px',
						textAlign: 'center',
					}}
				>
					所有問題
				</p>
				<ArticleIcon sx={{ color: '#9FAAE3', fontSize: '40px', ml: 1 }} />
			</Box>

			<Box display="flex" alignItems="center" gap={1}>
				<Button
					variant="contained"
					onClick={handleOpenModal}
					color="secondary"
					sx={{
						bgcolor: `${theme.palette.secondary.main} !important`,

						borderRadius: '20px',
					}}
				>
					<Typography variant="body1" style={{ fontSize: '20px' }}>
						{selectedTags.length > 0 ? '所選分類' : '選擇分類'}
					</Typography>
				</Button>
				{selectedTags.map((tag) => (
					<Chip
						key={tag}
						label={<Typography style={{ fontSize: '26px' }}>{tag}</Typography>}
					/>
				))}
			</Box>

			<Dialog open={isModalOpen} onClose={handleCloseModal}>
				<TagsSelector tags={tags} onSave={handleSave} onCancel={handleCloseModal} />
			</Dialog>
			<TextField
				placeholder="Search..."
				value={searchInput}
				onChange={handleSearchChange}
				sx={{ mt: 4, mb: 4, borderRadius: '15px' }}
				color="secondary"
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
					<QuestionCard key={question.questionId} {...question} />
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
