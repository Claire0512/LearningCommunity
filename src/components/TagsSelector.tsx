import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Chip } from '@mui/material';
import { Box } from '@mui/system';

interface Tag {
	id: number;
	name: string;
}

interface SelectedTag extends Tag {
	category: string;
}

interface TagsSelectorProps {
	tags: {
		[category: string]: Tag[];
	};
	onSave: (selected: SelectedTag[]) => void;
	onCancel: () => void;
}

interface SelectedTags {
	[category: string]: {
		[tagId: number]: boolean;
	};
}

function TagsSelector({ tags, onSave, onCancel }: TagsSelectorProps) {
	const [selectedTags, setSelectedTags] = useState<SelectedTags>({});

	const isTagSelected = (category: string, tag: Tag) => {
		return selectedTags[category]?.[tag.id] ?? false;
	};

	const toggleTag = (category: string, tag: Tag) => {
		setSelectedTags((prev) => ({
			...prev,
			[category]: {
				...prev[category],
				[tag.id]: !isTagSelected(category, tag),
			},
		}));
	};

	const onSaveClicked = () => {
		// Flatten selected tags into an array
		const selected: SelectedTag[] = Object.entries(selectedTags).flatMap(
			([category, tagsById]) =>
				Object.entries(tagsById)
					.filter(([, isSelected]) => isSelected)
					.map(([id]) => {
						const tag = tags[category].find((tag) => tag.id.toString() === id);
						return { id: parseInt(id), name: tag?.name || '', category };
					}),
		);

		onSave(selected);
	};

	return (
		<Dialog
			open
			onClose={onCancel}
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: '30px', // Adjust this value as needed
				},
			}}
		>
			<DialogTitle
				color="primary"
				sx={{
					fontWeight: 'bold',
					// color: theme.palette.primary.main,
					fontSize: '30px',
					textAlign: 'center',
				}}
			>
				選擇分類
			</DialogTitle>
			<DialogContent>
				{Object.entries(tags).map(([category, categoryTags]) => (
					<Box key={category} sx={{ mb: 2 }}>
						<Box sx={{ fontWeight: 'bold', mb: 1 }}>{category}:</Box>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
							{categoryTags.map((tag) => (
								<Chip
									label={tag.name}
									key={tag.id}
									clickable
									onClick={() => toggleTag(category, tag)}
									variant={isTagSelected(category, tag) ? 'filled' : 'outlined'}
									sx={{
										bgcolor: isTagSelected(category, tag)
											? 'primary.main'
											: 'default',
										color: isTagSelected(category, tag)
											? 'common.white'
											: 'text.primary',
										'&:hover': {
											bgcolor: 'primary.light',
										},
									}}
								/>
							))}
						</Box>
					</Box>
				))}
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel}>Cancel</Button>
				<Button onClick={onSaveClicked}>Save</Button>
			</DialogActions>
		</Dialog>
	);
}

export default TagsSelector;
