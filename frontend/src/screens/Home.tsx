import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Home(){
   const [auth, setAuth] = useState(false);
   const [name, setName] = useState("");

   useEffect(() =>{
      axios.get('http://localhost:8081/', { withCredentials: true }).
      then( res => {
         if(res.data.Status === "Success"){
            setAuth(true);
            setName(res.data.name);
         }
         else{
            setAuth(false);
         }
      })
   }, [])

   const handleLogout = ()=>{
      axios.get('http://localhost:8081/logout', { withCredentials: true })
      .then(res =>{
         if(res.data.Status === 'Success'){
            window.location.pathname = "/";
         }else{
            alert("Error")
         }
      }).catch( err => console.log(err))
   }
   return (
      <div>
         {
            auth ?
            <div className="home">
               <h1>Parabéns, você está logado {name}</h1>
            <button className="home-btn" onClick={handleLogout}>logout</button>
            </div>
            :
            <div>
               <h3>Login now</h3>
               <Link to="/">Login</Link>
            </div>

         }
         
      </div>
   )
}