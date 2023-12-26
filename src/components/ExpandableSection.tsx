'use client';

import React, { useState, ReactElement } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography, useTheme, Button, Box } from '@mui/material';

import { PostCardType, QuestionCardType } from '@/lib/types';

type Item = PostCardType | QuestionCardType;

interface ExpandableSectionProps {
	title: string;
	items: Item[];
	renderItem: (item: Item) => ReactElement;
}
export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
	title,
	items,
	renderItem,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const theme = useTheme();
	const handleToggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mt: 4,
				}}
			>
				<Box sx={{ width: '50%' }}></Box>
				<Typography
					variant="h5"
					component="h2"
					sx={{
						fontWeight: 'bold',
						position: 'absolute',
						width: '100%',
						textAlign: 'center',
					}}
				>
					{title}
				</Typography>
				<Box sx={{ mr: 10 }}>
					<Button onClick={handleToggleExpand}>
						{isExpanded ? (
							<>
								<span>收回</span>
								<ExpandLessIcon />
							</>
						) : (
							<>
								<span>展開</span>
								<ExpandMoreIcon />
							</>
						)}
					</Button>
				</Box>
			</Box>

			<Box
				sx={{
					width: '90%',
					marginRight: '45px',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 1,
					display: 'grid',

					mt: 2,
				}}
			>
				{items.map((item, index) => (isExpanded || index < 3) && renderItem(item))}
			</Box>
		</>
	);
};
