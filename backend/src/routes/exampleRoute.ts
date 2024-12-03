import {Request, Response, Router} from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript + Node.js');
});

export default router;