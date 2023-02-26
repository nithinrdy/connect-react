import { useContext } from 'react';
import { AuthContext } from '../contexts/authProvider';

export default function useAuth() {
	return useContext(AuthContext);
}
