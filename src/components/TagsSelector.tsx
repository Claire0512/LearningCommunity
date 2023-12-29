import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Chip } from '@mui/material';
import { Box } from '@mui/system';

interface TagsSelectorProps {
	tags: string[]; // 現在 tags 只是一個字串陣列
	onSave: (selected: string[]) => void;
	onCancel: () => void;
}

function TagsSelector({ tags, onSave, onCancel }: TagsSelectorProps) {
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const toggleTag = (tagName: string) => {
		const updatedSelectedTags = selectedTags.includes(tagName)
			? selectedTags.filter((tag) => tag !== tagName)
			: [...selectedTags, tagName];
		setSelectedTags(updatedSelectedTags);
	};

	const isTagSelected = (tagName: string) => {
		return selectedTags.includes(tagName);
	};

	const onSaveClicked = () => {
		onSave(selectedTags);
	};

	return (
		<Dialog
			open
			onClose={onCancel}
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: '30px',
					backgroundColor: '#FEFDFA',
				},
			}}
		>
			<DialogTitle
				color="primary"
				sx={{
					fontWeight: 'bold',
					fontSize: '26px',
					textAlign: 'center',
				}}
			>
				選擇分類
			</DialogTitle>
			<DialogContent>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
					{tags.map((tagName) => (
						<Chip
							label={tagName}
							key={tagName}
							clickable
							onClick={() => toggleTag(tagName)}
							variant={isTagSelected(tagName) ? 'filled' : 'outlined'}
							sx={{
								bgcolor: isTagSelected(tagName) ? 'secondary.main' : '#EBEBEB',
								color: isTagSelected(tagName) ? 'common.black' : 'common.black',
								'&:hover': {
									bgcolor: 'secondary.light',
								},
								borderColor: isTagSelected(tagName) ? 'secondary.main' : '#EBEBEB',
								borderWidth: '1px',
							}}
						/>
					))}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel}>Cancel</Button>
				<Button onClick={onSaveClicked}>Save</Button>
			</DialogActions>
		</Dialog>
	);
}

export default TagsSelector;
