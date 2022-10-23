import  Express  from "express";
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const router = Express.Router();
import { CourseModel, UserModel } from '../models';


// log in route
router.post("/login",async  (req, res) => {
 const { email:Email,password: Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }


    // check if user exists
    const user = await UserModel.findOne({ email:Email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
       

      const isMatch = await bcrypt.compare(Password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
       
            // login successful


            //generate Access token
            const Accesspayload = {email: Email };
             const accessToken = jwt.sign(Accesspayload, process.env.JWT_ACCESS_SECRET, {
                expiresIn: "15m",
            });

            //generate Refresh token
            const Refreshpayload = { username: user.username };
            const refreshToken = jwt.sign(Refreshpayload, process.env.JWT_REFRESH_SECRET, {
                expiresIn: "7d",
            });


            // encrypt refresh token
            const salt = await bcrypt.genSalt(10);
            const encryptedRefreshToken = await bcrypt.hash(refreshToken, salt);

            // save refresh token to db
            user.refreshToken = encryptedRefreshToken;
            await user.save();
          

          
            
                  
       
            return res.cookie("token", accessToken, { httpOnly: true }).json({ message: "Login successful" });
       
    }

    );


router.post("/register", async (req, res) => {
    const { name:name,username:username,gender:gender,email:email,password:password } = req.body;


    if (!email || !password||!name||!username||!gender) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    // check if user exists
   
 

    // check if email already exists
    const user = await UserModel.findOne({ email:email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    // check if username already exists
    const user2 = await UserModel.findOne({ username:username });
    if (user2) {
        return res.status(400).json({ message: "Username already exists" });
    }


            // hash password
            const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          
                

        // create new user
        const newUser = new UserModel({ name:name,
                                username:username,
                                email: email.toLowerCase(),
                                password: hashedPassword,
                                gender:gender
                });

       await newUser.save(async(err:any)  => {
            if (err) throw err;
           
            //generate access token
            const Accesspayload = { email: newUser.email };
            const accessToken = jwt.sign(Accesspayload, process.env.JWT_ACCESS_SECRET, {
                expiresIn: "15m",
            });


            // generate refresh token
            const Refreshpayload = { username: newUser.username };
            const refreshToken = jwt.sign(Refreshpayload, process.env.JWT_REFRESH_SECRET, {
                expiresIn: "7d",
            });


            // encrypt refresh token
            const salt = await bcrypt.genSalt(10);
            const encryptedRefreshToken = await bcrypt.hash(refreshToken, salt);
            // store refresh token in db
            newUser.refreshToken = encryptedRefreshToken;

                return res.cookie("token", accessToken, { httpOnly: true }).json({ message: "Registration successful" });
        });
        // generate access token
      

        


 
});
router.get("/logout", async(req, res) => {
   // remove refresh token from db  (to be done)
   
    res.clearCookie("token").json({ message: "Logout successful" });
});

export default router;