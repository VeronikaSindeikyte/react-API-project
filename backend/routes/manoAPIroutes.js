import express from 'express'
import * as controller from '../controllers/controllers.js'

const router = express.Router()

router.get('/pirkejai', controller.user_get);
router.delete('/pirkejai/:userId', controller.user_delete);
router.delete('/pirkejai/:userId/items/:itemId', controller.deletePurchasedItem);
router.post('/pirkejai', controller.user_post);
router.put('/pirkejai/:userId/items', controller.addNewItem);

export default router;

