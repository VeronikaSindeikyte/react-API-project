import User from '../models/pirkejas.js';
import mongoose from 'mongoose';


// ---------- USERS ----------

export const user_get = (req, res) => {
    const { firstName, lastName } = req.query;

    const query = {};
    if (firstName) query.firstName = firstName;
    if (lastName) query.lastName = lastName;

    User.find(query)
        .then(users => {
            console.log('Found users:', users);
            res.json(users);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: error.message }); 
        });
};

export const user_post = (req, res) => {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).send('Invalid input data');
    }

    const newUser = new User({
        firstName,
        lastName,
        email
    });

    newUser.save()
        .then(user => {
            console.log('New developer added:', user);
            res.status(201).send(user);
        })
        .catch(error => {
            console.log('Error saving new user:', error);
            res.status(500).send(error.message);
        });

};

export const user_delete = (req, res) => {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send('Invalid user ID');
    }

    User.findByIdAndDelete(userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).send('User not found');
            }
            console.log('User deleted:', deletedUser);
            res.status(200).send(`User with ID ${userId} deleted successfully`);
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            res.status(500).send(error.message);
        });
};


// ---------- ITEMS ----------

export const addNewItem = async (req, res) => {
    try {
      const { itemName, quantity, price, purchaseDate } = req.body;
      const userId = req.params.userId;
  
      const newItem = {
        itemId: new mongoose.Types.ObjectId(),
        itemName,
        quantity,
        price,
        purchaseDate,
      };
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { purchasedItems: newItem } },
        { new: true, runValidators: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error adding item to purchasedItems:', error);
      res.status(500).send('Failed to add item');
    }

};


export const deletePurchasedItem = (req, res) => {
    const userId = parseInt(req.params.userId, 10);  
    const itemId = parseInt(req.params.itemId, 10);  

    if (!userId || isNaN(itemId)) {
        return res.status(400).send('Missing or invalid parameters');
    }

    User.updateOne(
        { userId: userId }, 
        { $pull: { purchasedItems: { itemId: itemId } } }  
    )
    .then(result => {
        if (result.modifiedCount > 0) {
            console.log('Item deleted:', result);
            res.status(200).send('Item successfully deleted from purchased items');
        } else {
            console.log('No item found to delete');
            res.status(404).send('No item found with the specified ID in purchased items');
        }
    })
    .catch(error => {
        console.log('Error during deletion:', error);
        res.status(500).send(error.message);
    });
};
