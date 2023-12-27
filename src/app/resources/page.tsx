'use client';

import React, { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

import PostCard from '../../components/PostCard';
import TagsSelector from '../../components/TagsSelector';
import ArticleIcon from '@mui/icons-material/Article';
import CreateIcon from '@mui/icons-material/Create';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useTheme, Fab, Box, Button, Dialog, TextField, Chip, Typography } from '@mui/material';

import type { PostCardType } from '@/lib/types';

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
const sampleHotPosts = [
	{
		postId: 501,
		postTitle: 'Innovative Tech Gadgets',
		postContext: 'Exploring the latest in technology and gadgets.',
		posterId: 789,
		posterName: 'TechEnthusiast',
		profilePicture: 'url/to/profile/picture3.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['technology', 'gadgets', 'innovation'],
	},
	{
		postId: 502,
		postTitle: 'Healthy Eating Habits',
		postContext: 'Tips for maintaining a healthy and balanced diet.',
		posterId: 101,
		posterName: 'HealthyFoodie',
		profilePicture: 'url/to/profile/picture4.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['health', 'diet', 'nutrition'],
	},
	{
		postId: 503,
		postTitle: 'Adventure Travel Destinations',
		postContext: 'Top destinations for adventure travel enthusiasts.',
		posterId: 202,
		posterName: 'GlobeTrotter',
		profilePicture: 'url/to/profile/picture5.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['travel', 'adventure', 'destinations'],
	},
];
const sampleAllPosts = [
	{
		postId: 456,
		postTitle: 'Delicious Recipes',
		postContext: 'Sharing my favorite homemade recipes.',
		posterId: 123,
		posterName: 'GlobeTrotter',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['food', 'recipes', 'cooking'],
	},
	{
		postId: 457,
		postTitle: 'Traveling Tips',
		postContext: 'Essential tips for budget traveling.',
		posterId: 456,
		posterName: 'GlobeTrotter',
		profilePicture: 'url/to/profile/picture2.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['travel', 'budget', 'advice'],
	},
	{
		postId: 458,
		postTitle: 'Delicious Recipes',
		postContext: 'Sharing my favorite homemade recipes.',
		posterId: 123,
		posterName: 'GlobeTrotter',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['food', 'recipes', 'cooking'],
	},
	{
		postId: 459,
		postTitle: 'Traveling Tips',
		postContext: 'Essential tips for budget traveling.',
		posterId: 456,
		posterName: 'GlobeTrotter',
		profilePicture: 'url/to/profile/picture2.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['travel', 'budget', 'advice'],
	},
	{
		postId: 460,
		postTitle: 'Delicious Recipes',
		postContext: 'Sharing my favorite homemade recipes.',
		posterId: 123,
		posterName: 'GlobeTrotter',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['food', 'recipes', 'cooking'],
	},
	{
		postId: 461,
		postTitle: 'Traveling Tips',
		postContext: 'Essential tips for budget traveling.',
		posterId: 456,
		posterName: 'GlobeTrotter',
		profilePicture: 'url/to/profile/picture2.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['travel', 'budget', 'advice'],
	},
	{
		postId: 462,
		postTitle: 'Delicious Recipes',
		postContext: 'Sharing my favorite homemade recipes.',
		posterId: 123,
		posterName: 'GlobeTrotter',
		profilePicture: 'url/to/profile/picture1.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
		tags: ['food', 'recipes', 'cooking'],
	},
	{
		postId: 463,
		postTitle: 'Traveling Tips',
		postContext: 'Essential tips for budget traveling.',
		posterId: 456,
		posterName: 'GlobeTrotter',
		profilePicture: 'url/to/profile/picture2.jpg',
		upvotes: 250,
		downvotes: 15,
		commentsCount: 45,
		favorites: 100,
		createdAt: '2023 11 05 19:00',
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
	const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<PostCardType[]>(sampleAllPosts);
	const [searchInput, setSearchInput] = useState('');
	const { data: session } = useSession();
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	const handleSave = (selected: SelectedTag[]) => {
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
		const filterByTags =
			selectedTags.length > 0
				? (post: PostCardType) =>
						selectedTags
							.map((tag) => tag.name)
							.every((tagName) => post.tags.includes(tagName))
				: (post: PostCardType) => true;

		const filterBySearch = (post: PostCardType) =>
			post.postTitle.toLowerCase().startsWith(searchInput.toLowerCase());

		const newFilteredPosts = sampleAllPosts.filter(
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
						color: '#000000',
						fontSize: '32px',
						textAlign: 'center',
					}}
				>
					本日熱門文章
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
				{sampleHotPosts.map((post) => (
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
						color: '#000000',
						fontSize: '32px',
						textAlign: 'center',
					}}
				>
					所有文章
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
