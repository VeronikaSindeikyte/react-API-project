import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
        <h1>Find your purchase history!</h1>
        <div className="links">
           <Link to="/">Home</Link>
           <Link to="/create">Create a new Buyer</Link>
           <Link to="/addProduct">Add new Product</Link>
        </div>
    </nav>
  );
}

export default Navbar;