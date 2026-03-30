import { Router } from 'express'
import {
  getAllOutfits,
  getOutfitById,
  createOutfit,
  updateOutfit,
  deleteOutfit,
} from '../controllers/outfitsController.js'

const router = Router()

router.get('/', getAllOutfits)
router.get('/:id', getOutfitById)
router.post('/', createOutfit)
router.put('/:id', updateOutfit)
router.delete('/:id', deleteOutfit)

export default router
