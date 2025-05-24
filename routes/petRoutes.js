import { Router } from 'express';
import { listPets, addPet, updatePet, deletePet } from '../controllers/PetController.js';

const router = Router();


router.get('/', listPets);

router.post('/add', addPet);

router.put('/:id', updatePet);

router.delete('/:id', deletePet);

export const petRouter = router;