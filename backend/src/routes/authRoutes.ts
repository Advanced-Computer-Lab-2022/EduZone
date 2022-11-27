import Express from 'express';
import { JWTAccessDecoder, JWTRefreshDecoder } from '../middlewares/jwt';

const router = Express.Router();
import { login, logout, refreshTokens, register } from '../services';

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
    return res.status(200).json({ message: 'Register successful', ...tokens });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: (error as any).message });
  }
});
router.post('/logout', JWTAccessDecoder, async (req, res) => {
  // remove refresh token from db  (to be done)
  try {
    const { id } = req.body.token;
    const success = await logout(id);
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: (error as Error).message });
  }
});

router.get('/refresh', JWTRefreshDecoder, async (req, res) => {
  try {
    const id = req.body.refreshToken.id as string;
    const oldRefreshToken = req.headers.authorization?.split(' ')[1];
    const { accessToken, refreshToken } = await refreshTokens(
      id,
      oldRefreshToken || ''
    );
    return res
      .status(200)
      .json({ message: 'Refresh successful', accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: (error as Error).message });
  }
});

export default router;
