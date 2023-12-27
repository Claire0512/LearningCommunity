import api from '@/lib/api/base';

export const addNewTags = async (tagName: string) => {
	try {
		await api.post('/api/tags', { name: tagName });
	} catch (err) {
		console.error('Error addNewTags :', err);
		throw err;
	}
};

export const getAllTags = async () => {
	try {
		const response = await api.get('/api/tags');
		// console.log('response.data:', response.data);
		return response.data as string[];
	} catch (error) {
		console.error('Error getAllTags :', error);
		throw error;
	}
};
