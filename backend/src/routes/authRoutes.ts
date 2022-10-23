import Express from 'express';

const router = Express.Router();
import { login, logout, register } from '../controllers';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    //TODO: check DTO
    const tokens = await login(username, password);
    return res.status(200).json({ message: 'Login successful', ...tokens });
  } catch (error) {
    return res.status(400).json({ message: (error as any).message });
  }
});

router.post('/register', async (req, res) => {
  const {
    name: name,
    username: username,
    gender: gender,
    email: email,
    password: password,
  } = req.body;

  if (!email || !password || !name || !username || !gender) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }
  try {
    //TODO: check DTO
    const tokens = await register(name, username, email, password, gender);
    return res.status(200).json({ message: 'Login successful', ...tokens });
  } catch (error) {
    return res.status(400).json({ message: (error as any).message });
  }
});
router.post('/logout', async (req, res) => {
  // remove refresh token from db  (to be done)
  try {
    const { id } = req.body.token;
    await logout(id);
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(400).json({ message: (error as any).message });
  }
});

export default router;
