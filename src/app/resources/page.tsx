'use client';

import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import PostCard from '../../components/PostCard';
import TagsSelector from '../../components/TagsSelector';
import { getAllPosts, getTop3HotPosts } from '../../lib/api/resources/apiEndpoints';
import { getAllTags } from '../../lib/api/tags/apiEndpoints';
import ArticleIcon from '@mui/icons-material/Article';
import CreateIcon from '@mui/icons-material/Create';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useTheme, Fab, Box, Button, Dialog, TextField, Chip, Typography } from '@mui/material';

import type { PostCardType } from '@/lib/types';

function Page() {
	const theme = useTheme();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<PostCardType[]>([]);
	const [hotPosts, setHotPosts] = useState<PostCardType[]>([]);
	const [searchInput, setSearchInput] = useState('');

	const [tags, setTags] = useState<string[]>([]);
	const { data: session } = useSession();
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	const handleSave = (selected: string[]) => {
		setSelectedTags(selected);
		handleCloseModal();
		console.log('Selected tags:', selected);
	};
	const handleCreatePostClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (!session) {
			alert('登入後才可發文哦');
			event.preventDefault();
		}
	};
	useEffect(() => {
		async function fetchTags() {
			try {
				const fetchedTags = await getAllTags();
				console.log('Fetched tags:', fetchedTags);
				setTags(fetchedTags);
			} catch (error) {
				console.error('Error fetching tags:', error);
			}
		}
		fetchTags();
	}, []);
	useEffect(() => {
		async function fetchData() {
			try {
				const allPosts = await getAllPosts();
				const topHotPosts = await getTop3HotPosts();
				setFilteredPosts(allPosts);
				setHotPosts(topHotPosts);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		const filterByTags =
			selectedTags.length > 0
				? (post: PostCardType) =>
						selectedTags.every((tagName) => post.tags.includes(tagName))
				: (post: PostCardType) => true;
		const filterBySearch = (post: PostCardType) =>
			post.postTitle.toLowerCase().startsWith(searchInput.toLowerCase());

		const newFilteredPosts = filteredPosts.filter(
			(post: PostCardType) => filterByTags(post) && filterBySearch(post),
		);
		setFilteredPosts(newFilteredPosts);
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
					本日熱門文章
				</p>
				<LocalFireDepartmentIcon sx={{ color: '#E09090', fontSize: '40px', ml: 1 }} />
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
				{hotPosts.map((post) => (
					<PostCard {...post} />
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
					所有文章
				</p>
				<ArticleIcon sx={{ color: '#9FAAE3', fontSize: '40px', ml: 1 }} />
			</Box>

			<Box display="flex" alignItems="center" gap={1} sx={{ mt: '8px' }}>
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
				<TagsSelector tags={tags} onSave={handleSave} onCancel={handleCloseModal} />{' '}
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
				{filteredPosts.map((post) => (
					<PostCard {...post} />
				))}
			</Box>
			<a
				href="/resources/post/new"
				style={{ textDecoration: 'none' }}
				onClick={handleCreatePostClick}
			>
				<Fab
					color="secondary"
					aria-label="我要發文"
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
