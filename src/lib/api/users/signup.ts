import axios from 'axios';

export default async function signUp(email: string, username: string, password: string) {
	try {
		await axios.post('http://localhost:3000/api/users', {
			email,
			name: username,
			password,
		});
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
