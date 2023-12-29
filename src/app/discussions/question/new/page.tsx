'use client';

import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

import TagsSelector from '../../../../components/TagsSelector';
import { addNewQuestion } from '../../../../lib/api/discussions/apiEndpoints';
import { getAllTags } from '../../../../lib/api/tags/apiEndpoints';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
	Button,
	Card,
	CardContent,
	Typography,
	TextField,
	Dialog,
	useTheme,
	Chip,
	Box,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { UploadButton } from '@/utils/uploadthing';

function Page() {
	const theme = useTheme();
	const [tags, setTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const { data: session, status } = useSession();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [images, setImages] = useState<string[]>([]);
	const router = useRouter();
	const [modalOpen, setModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState('');

	const openModal = (content: string) => {
		setModalContent(content);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};
	const handleSave = (selected: string[]) => {
		setSelectedTags(selected);
		handleCloseModal();
		console.log('Selected tags:', selected);
	};
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);
	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};
	if (status === 'loading') return <div>Loading...</div>;
	if (status === 'unauthenticated') redirect('/discussions');
	useEffect(() => {
		const fetchTags = async () => {
			try {
				const fetchedTags = await getAllTags();
				setTags(fetchedTags);
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
			openModal('標題和內文不能為空！');
			return;
		}

		const questionerId = session?.user.userId;

		const newQuestion = {
			questionTitle: title,
			questionContext: content,
			questionerId: questionerId,
			tags: selectedTags,
			questionImages: images,
		};

		try {
			await addNewQuestion(newQuestion);

			openModal('問題已成功提交！');
			setTitle('');
			setContent('');
			setSelectedTags([]);
			router.push('/discussions');
		} catch (error) {
			console.error('添加問題失敗:', error);
			openModal('提交問題時出現錯誤！');
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
					top: '-50px',
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
					mt: '10px',
				}}
			>
				<CardContent sx={{ flex: '1 0 auto' }}>
					<Typography variant="h5" align="center" gutterBottom sx={{ mt: '10px' }}>
						發佈問題
					</Typography>
					<TextField
						label="標題"
						variant="standard"
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
							paddingBottom: '30px',
							paddingLeft: '13px',
							'& .MuiInputLabel-root': {
								left: '13px',
							},
						}}
					/>

					<TextField
						fullWidth
						label="內文"
						variant="outlined"
						multiline
						minRows={4}
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
							'& .MuiInputLabel-root': {
								left: '10px',
							},
							paddingBottom: '30px',
							paddingLeft: '10px',
							paddingRight: '10px',
						}}
					/>

					<Box display="flex" alignItems="center" gap={1} sx={{ paddingBottom: '30px' }}>
						<Button
							onClick={handleOpenModal}
							variant="text"
							color="secondary"
							sx={{
								borderRadius: '10px',
								height: '40px',
								width: '100px',
								minWidth: '100px',
							}}
						>
							<Typography style={{ fontSize: '16px', color: 'grey' }}>
								{selectedTags.length > 0 ? '所選標籤' : '選擇標籤'}
							</Typography>
						</Button>
						{selectedTags.map((tag) => (
							<Chip
								key={tag}
								label={<Typography style={{ fontSize: '16px' }}>{tag}</Typography>}
							/>
						))}
					</Box>

					<UploadButton
						className="* mt-2 ut-button:rounded-lg ut-button:bg-[#BFD1ED] ut-button:after:bg-[#BFD1ED] ut-button:focus-within:ring-[#BFD1ED]
						ut-button:focus-within:ring-offset-2 ut-button:ut-uploading:bg-[#BFD1ED] ut-button:ut-uploading:focus-within:ring-[#BFD1ED] "
						endpoint="imageUploader"
						onClientUploadComplete={(res) => {
							const imageUrls = res.map((item) => item.url);
							setImages(imageUrls);
						}}
						onUploadError={(error: Error) => {
							openModal(`ERROR! ${error.message}`);
						}}
					/>
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
							color: 'white',
						}}
					>
						送出
					</Button>
				</Box>
			</Card>
			<Dialog open={isModalOpen} onClose={handleCloseModal}>
				<TagsSelector tags={tags} onSave={handleSave} onCancel={handleCloseModal} />
			</Dialog>
			<Dialog
				open={modalOpen}
				onClose={closeModal}
				PaperProps={{ sx: { borderRadius: '10px', backgroundColor: '#FEFDFA' } }}
			>
				<DialogTitle>提示</DialogTitle>
				<DialogContent>
					<DialogContentText>{modalContent}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeModal}>確定</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default Page;
