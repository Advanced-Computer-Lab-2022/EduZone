import Express from 'express';
import { JWTAccessDecoder, JWTRefreshDecoder } from '../middlewares/jwt';
import crypto from 'crypto';

const router = Express.Router();
import {
  login,
  logout,
  refreshTokens,
  register,
  forgetPassword,
  resetPassword,
  changePassword,
} from '../services';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    //TODO: check DTO
    const tokens = await login(username, password);
    // res.cookie('refreshToken', tokens.refreshToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    // });

    // res.cookie('accessToken', tokens.accessToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 1, // 15 minutes
    // });
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
    // res.cookie('refreshToken', tokens.refreshToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    // });

    // res.cookie('accessToken', tokens.accessToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60* 15, // 15 minutes
    // });

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

router.put('/reset-password/:resetToken', async (req, res) => {
  try {
    const resetToken = req.params.resetToken;
    const { password } = req.body;
    const success = await resetPassword(resetToken, password);
    return res.status(202).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});

router.post('/forget-password', async (req, res) => {
  try {
    const { email } = req.body;
    const success = await forgetPassword(email);
    if (success)
      return res.status(200).json({ message: 'mail sent successfully' });
    else return res.status(400).json({ message: 'mail not sent' });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});
router.put('/change-password', JWTAccessDecoder, async (req, res) => {
  try {
    const { id } = req.body.token;
    const { password, oldPassword } = req.body;
    const success = await changePassword(id, oldPassword, password);
    return res.status(202).json({ message: 'Password changed successfully' });
  } catch (error) {
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
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7,
    // });

    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60* 15, // 15 minutes
    // });
    return res
      .status(200)
      .json({ message: 'Refresh successful', accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: (error as Error).message });
  }
});

export default router;
