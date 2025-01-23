import { useState, useEffect } from 'react';

const AddProduct = () => {
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3005/api/pirkejai');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!itemName || !quantity || !price || !purchaseDate || !selectedUser) {
            setError('All fields are required, including user selection.');
            setSuccess('');
            return;
        }

        if (purchaseDate.trim() === '') {
            setError('Purchase date cannot be empty.');
            setSuccess('');
            return;
        }

        setError('');

        const newItem = {
            itemName,
            quantity: parseInt(quantity, 10),
            price: parseFloat(price),
            purchaseDate,
        };

        try {
            const response = await fetch(`http://localhost:3005/api/pirkejai/${selectedUser}/items`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to add item');
            }

            const updatedUser = await response.json();

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === updatedUser._id ? updatedUser : user
                )
            );

            setSuccess('Item successfully added!');
            setItemName('');
            setQuantity('');
            setPrice('');
            setPurchaseDate('');
        } catch (err) {
            console.error('Error adding item:', err);
            setError('Failed to add item. Please try again.');
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

            if (!response.ok) throw new Error('Failed to delete item');

            const updatedUser = await response.json();

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === updatedUser._id ? updatedUser : user
                )
            );
            alert('Purchased item deleted successfully!');
        } catch (err) {
            console.error('Error deleting item:', err);
        }
    };

    const user = users.find((user) => user._id === selectedUser);

    return (
        <div className="create-item">
            <h1>Add new Product</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="userSelect">Select User:</label>
                <select
                    id="userSelect"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                >
                    <option value="">-- Select User --</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
                <br />
                <label htmlFor="itemName">Item Name:</label>
                <input
                    type="text"
                    id="itemName"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="quantity">Quantity of items purchased:</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="price">Price of the item:</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <br />
                <label htmlFor="date">Date of purchase:</label>
                <input
                    type="text"
                    id="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    required
                />
                <br />
                {error && <div className='error-msg' style={{ color: 'red' }}>{error}</div>}
                {success && <div className='success-msg' style={{ color: 'green' }}>{success}</div>}
                <button type="submit">Add New Item</button>
            </form>

            {user && (
                <>
                    <h2>{user.firstName} {user.lastName} Items</h2>
                    <ul className="purchased-items">
                        {user.purchasedItems?.length > 0 ? (
                            user.purchasedItems.map((item, index) => (
                                <li key={item.itemId || `${user._id}-${index}`}>
                                    <div className="name-and-trashcan">
                                        <span className="item-name">{item.itemName}</span>
                                        <svg
                                            className="trashcan"
                                            onClick={() => handleDelete(user._id, item.itemId)}
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth="0"
                                            viewBox="0 0 12 16"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="quantity">Quantity: {item.quantity}</span>
                                    <span className="price">${item.price.toFixed(2)}</span>
                                    <span className="purchase-date">{item.purchaseDate}</span>
                                </li>
                            ))
                        ) : (
                            <li>No purchased items</li>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default AddProduct;
