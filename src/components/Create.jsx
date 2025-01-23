import { useState, useEffect } from 'react';

const Create = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3005/api/pirkejai');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const usersData = await response.json();
            setUsers(usersData);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email) {
            setError('Please fill in all fields');
            return;
        }

        const newUser = {
            firstName,
            lastName,
            email,
            purchasedItems: []
        };

        try {
            const response = await fetch('http://localhost:3005/api/pirkejai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to create user, status: ${response.status}`);
            }

            setFirstName('');
            setLastName('');
            setEmail('');
            setError(null);
            fetchUsers(); 
            alert('User created successfully!');
        } catch (err) {
            console.error('Error during fetch:', err);
            setError(err.message || 'An error occurred while creating the user.');
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3005/api/pirkejai/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            fetchUsers(); 
            alert('User deleted successfully!');
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    return (
        <div className='create-user'>
            <h1>Create New User</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit">Create User</button>
            </form>

            <h2>All Users</h2>
              <ul>
                {users.map(user => (
                    <li key={user._id}>
                        <span>{user.firstName} {user.lastName}</span>
                        <span>{user.email}</span>
                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </li>
                ))}
              </ul>
        </div>
    );
};

export default Create;
