import { useState, useEffect } from 'react';

import { useSession } from 'next-auth/react';

const useRedirect = () => {
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [redirectURL, setRedirectURL] = useState('');
	const { data: session } = useSession();
	useEffect(() => {
		if (!session) {
			setIsRedirecting(true);
			setRedirectURL('/');
		} else {
			// setRestaurantId(parsedId);
			// const fetchData = async () => {
			// 	const data = await getRestaurantInfoStatus(parsedId);
			// 	if (!data) {
			// 		setIsRedirecting(true);
			// 		setRedirectURL('/operations-management/basic-information');
			// 	}
			// };
			// fetchData();
		}
	}, []);

	return { isRedirecting, redirectURL };
};

export default useRedirect;
