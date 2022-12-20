import Express from 'express';
const router = Express.Router();
import fs from 'fs';
router.get('/certificates', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }
  try {
    const file = fs.createReadStream(`${process.cwd()}/${url}`);
    const stat = fs.statSync(`${process.cwd()}/${url}`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + (url as string).split('/').pop()
    );
    file.pipe(res);
  } catch (error) {
    return res.status(400).json({ message: (error as any).message });
  }
});

export default router;
