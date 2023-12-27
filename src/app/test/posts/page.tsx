'use client';

import React, { useState } from 'react';
import { ChangeEvent } from 'react';

import { Container, TextField, Button, Box, Typography } from '@mui/material';

import {
	getAllPosts,
	getTop3HotPosts,
	getPostDetail,
	addCommentToPost,
	addReplyToComment,
	interactWithPost,
	interactiWithPostComment,
	addNewPost,
} from '@/lib/api/posts/apiEndpoints';

const samplePost = {
	postTitle: '',
	postContext: '',
	posterId: 0,
	tags: ['tag1', 'tag2', 'tag3'],
};

const TestApiInterface = () => {
	// State for getAllPosts
	const [pageNumber, setPageNumber] = useState('');

	// State for getPostDetail
	const [postId, setPostId] = useState('');

	// State for addCommentToPost
	const [commentPostId, setCommentPostId] = useState('');
	const [commenterId, setCommenterId] = useState('');
	const [commentText, setCommentText] = useState('');

	// State for addReplyToComment
	const [parentCommentId, setParentCommentId] = useState('');
	const [replierId, setReplierId] = useState('');
	const [replyText, setReplyText] = useState('');

	// State for interactWithPost
	const [interactUserId, setInteractUserId] = useState('');
	const [interactPostId, setInteractPostId] = useState('');
	const [actionType, setActionType] = useState('');

	// State for interactWithPostComment
	const [commentUserId, setCommentUserId] = useState('');
	const [commentId, setCommentId] = useState('');
	const [commentActionType, setCommentActionType] = useState('');

	// State for addNewPost
	const [newPost, setNewPost] = useState(samplePost);

	// Replace these stubs with actual API calls
	const handleGetAllPosts = async () => {
		console.log('Get All Posts:', pageNumber);
		// Call the getAllPosts API function here
	};

	const handleGetPostDetail = async () => {
		console.log('Get Post Detail:', postId);
		// Call the getPostDetail API function here
	};

	const handleAddCommentToPost = async () => {
		console.log('Add Comment:', commentPostId, commenterId, commentText);
		// Call the addCommentToPost API function here
	};

	const handleAddNewPost = async () => {
		try {
			await addNewPost(newPost);
		} catch (error) {
			console.error(error);
		}
	};

	const changePost = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (event.target.name === 'posterId') {
			setNewPost({ ...newPost, posterId: parseInt(event.target.value) });
		} else {
			setNewPost({
				...newPost,
				[event.target.name]: event.target.value,
			});
		}
	};

	// ...similarly implement other handlers for API calls

	return (
		<Container>
			<Typography variant="h4" gutterBottom>
				API Test Interface
			</Typography>

			<Box my={4}>
				<TextField
					label="Page Number"
					value={pageNumber}
					onChange={(e) => setPageNumber(e.target.value)}
					margin="normal"
					fullWidth
				/>
				<Button variant="contained" color="primary" onClick={handleGetAllPosts}>
					Get All Posts
				</Button>
			</Box>

			<Box my={4}>
				<TextField
					label="Post ID"
					value={postId}
					onChange={(e) => setPostId(e.target.value)}
					margin="normal"
					fullWidth
				/>
				<Button variant="contained" color="primary" onClick={handleGetPostDetail}>
					Get Post Detail
				</Button>
			</Box>

			<Box my={4}>
				<TextField
					label="Post Title"
					name="postTitle"
					value={newPost.postTitle}
					onChange={changePost}
					margin="normal"
				/>
				<TextField
					label="Post Context"
					name="postContext"
					value={newPost.postContext}
					onChange={changePost}
					margin="normal"
				/>
				<TextField
					label="Poster Id"
					name="posterId"
					value={newPost.posterId.toString()}
					onChange={changePost}
					margin="normal"
				/>
				<Button variant="contained" color="primary" onClick={handleAddNewPost}>
					Add New Post
				</Button>
			</Box>

			{/* Similar structure for other API forms... */}
		</Container>
	);
};

export default TestApiInterface;
