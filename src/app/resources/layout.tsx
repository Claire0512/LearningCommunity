'use client';

import React, { useState, useEffect } from 'react';

import Bar from '../../components/AppBar';
import PostCard from '../../components/PostCard';
import TagsSelector from '../../components/TagsSelector';
import ArticleIcon from '@mui/icons-material/Article';
// import useRedirect from '@/hooks/useRedirect';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Box, Button, Dialog, TextField, Chip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { PostCardType } from '@/lib/types';
import { theme } from '@/theme/Theme';

type Props = {
	children: React.ReactNode;
};

const layout = ({ children }: Props) => {
	const theme = useTheme();
	return (
		<Box
			component="main"
			className="flex min-h-full flex-col"
			sx={{ backgroundColor: theme.palette.background.default }}
		>
			<Bar activeButton="學習資源" />

			<Box className="mt-[100px] flex flex-1 flex-col items-center">
				<Box
					sx={{
						width: '100%',
						overflow: 'visible',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: 10,
					}}
				>
					{children}
				</Box>
			</Box>
		</Box>
	);
};

export default layout;
