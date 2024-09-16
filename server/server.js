import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST, GET"],
    credentials: true,
  })
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect();

const verifyUser = (req, res, next) =>{
   const token = req.cookies.token;
   if(!token){
      return res.json({Message: "we need token please provide it."})
   }
   else{
      jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded ) =>{
         if(err){
            return res.json({Message: "Authentication Error "})
         }
         else{
            req.name = decoded.name;
            next()
         }
      })
   }

}

app.get('/', verifyUser, (req, res) =>{
   return res.json({Status: "Success", name: req.name})
})

app.post("/login", (req, res) => {

  const sql = "SELECT * FROM login WHERE email = ?";

  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login error" });

    if (data.length > 0) {
      bcrypt.compare(req.body.password, data[0].password, function(err, res) {
        if(err) return res.json({ Error: "Password compare error"});
        if(response){
          
          const name = data[0].name;
          const token = jwt.sign({ name }, "our-jsonwebtoken-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token);
          return res.json({ Status: "Success" });

        }
        else{
          return res.json({Error: "Password not matched"})
        }
      });
    } else {
      return res.json({ Message: "No Email existed" });
    }
    
  });
});

app.post('/register', (req, res) => {
  const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
  
  bcrypt.hash(req.body.password, 8, function(err, hash) {
    if(err) return res.json({ error: "Error for hassing password"});

    db.query(sql, [req.body.name, req.body.email, hash], (err, result) => {
      if (err) {
        return res.json({ Error: "Inserting data error in server" });
      }
      return res.json({ Status: "Success" });
    });
  });
});

app.get('/logout', (req, res) =>{
   res.clearCookie('token');
   return res.json({Status: "Success"})
})

app.listen(8081, () => {
  console.log("Running");
});
