import { useState } from 'react';

const Users = () => {
    const [users, setUsers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const firstName = e.target.firstName.value.trim();
        const lastName = e.target.lastName.value.trim();

        try {
            const response = await fetch(`http://localhost:3005/api/pirkejai?firstName=${firstName}&lastName=${lastName}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            setUsers(json);
        } catch (err) {
            console.error('Error during fetch:', err);
        }
    };

    const handleDelete = async (userId, itemId) => {
        try {
            const response = await fetch(`http://localhost:3005/api/pirkejai/${userId}/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const contentType = response.headers.get("content-type");
            let updatedUser;
            if (contentType && contentType.includes("application/json")) {
                updatedUser = await response.json(); 
            } else {
                const message = await response.text();
                console.log(message); 
                updatedUser = {}; 
            }
    
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.userId === updatedUser.userId ? updatedUser : user
                )
            );
            alert('Purchased item deleted successfully!');
        } catch (err) {
            console.error('Error during fetch:', err);
        }
    };

    return (
        <div id="user-container">
            <form id="search" onSubmit={handleSubmit}>
                <label htmlFor="firstName">Enter your first name:</label>
                <input type="text" name="firstName" placeholder="Buyer's first name" required />
                <label htmlFor="lastName">Enter your last name:</label>
                <input type="text" name="lastName" placeholder="Buyer's last name" required />
                <input type="submit" value="Find buyer" />
            </form>
            <ul>
                {users.map(user => (
                    <li key={user.userId}>
                        <span className="id">{user.userId}</span>
                        <span className="name">{user.firstName} {user.lastName}</span>
                        <span className="email">{user.email}</span>
                        <a href={"/AddProduct"} className='add-button'>
                            <svg
                            className='cart-icon'
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"></path>
                            </svg>Add a new product to the list
                        </a>
                        <ul className="purchased-items">
                            {user.purchasedItems && user.purchasedItems.length > 0 ? (
                                user.purchasedItems.map(item => (
                                    <li key={item.itemId}>
                                        <div className='name-and-trashcan'>
                                            <span className="item-name">{item.itemName} </span>
                                            <svg
                                            className="trashcan"
                                            onClick={() => handleDelete(user.userId, item.itemId)} 
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth="0"
                                            viewBox="0 0 12 16"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"></path>
                                            </svg>
                                        </div>
                                        <span className="quantity">Quantity: - {item.quantity}</span>
                                        <span className="price">${item.price.toFixed(2)}</span>
                                        <span className="purchase-date">{item.purchaseDate}</span>
                                    </li>
                                ))
                            ) : (
                                <li>No purchased items</li>
                            )}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Users;