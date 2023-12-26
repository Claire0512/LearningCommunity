import axios from "axios";
export default async function signUp(email: string, username: string, password: string) {
    try {
        const response = await axios.post("http://localhost:3000/api/users", {
            email,
            name: username,
            password
        })
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return {}
    }
}