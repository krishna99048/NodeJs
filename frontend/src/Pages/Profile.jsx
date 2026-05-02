import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../Context/UserContext";


export default function ProfilePage() {

const [data, setData] = useState("");
const [error, seterror] = useState("");
const {centerData} = useContext(DataContext)
console.log(centerData);

const navigate = useNavigate();

useEffect(()=>{

const FetchData = async () =>{


  try {
    let response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`,
      { headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
  }
);

    setData(response?.data?.user);
  } catch (error) {
     console.log(error.response);
     seterror(error.response?.data?.message);
  }
};
FetchData();
}, [])


const logout = async()=>{
  try {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`,{ headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
  }
  );

  localStorage.setItem("token" , " ");
  navigate("/login")

  } catch (error) {
    console.log(error.response)
  }
}

// const update = async()=>{
//   try {
//     await axios.put(`${import.meta.env.VITE_BASE_URL}/user/update`,{ headers:{
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       },
//   }
//   );

//   localStorage.setItem("token" , " ");
//   navigate("/update")

//   } catch (error) {
//     console.log(error.response)
//   }
// }

  return (
    <>

    {error && (

     <div className="w-full h-screen bg-white flex items-center justify-center text-9xl font-bold text-red-700">
       Access Denided ...
    </div>
    )}

      {data?.username && (<div className="min-h-screen flex items-center justify-center px-4 bg-[#050505]">
      <div className="relative group">
        {/* Decorative Glow */}
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-black border border-white/10 rounded-3xl p-12 w-full max-w-2xl text-white text-center">
          
          {/* Edit Icon Button */}

          <Link to="/edit-profile">
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group/edit"
            onClick={()=> navigate("edit-profile")}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
            </svg>
          </button>

          </Link>

          <div className="relative inline-block mb-6">
            <img
              src="https://media.easy-peasy.ai/447638f0-65fd-449c-9a6c-c7840adf9777/44846dbd-7e05-4cab-89db-1d4510e5a89c.png"
              alt="avatar"
              className="w-28 h-28 rounded-3xl object-cover border-2 border-white/10 p-1"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-black"></div>
          </div>

          <h2 className="text-3xl font-bold mb-1">Welcome !!</h2>
          <p className="mb-8 text-indigo-300/60 font-medium tracking-wide">You are a verified user now !!</p>

          <div className="flex flex-col gap-4 mb-8 text-left">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase text-indigo-300 font-bold">Username</p>
              <p className="text-md font-bold">{data?.username || "N/A"}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase text-indigo-300 font-bold">Email</p>
              <p className="text-md font-bold">{data?.email || "N/A"}</p>
            </div>
          </div>

          <button 
          onClick={logout}
            className="w-full border border-white/10 text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition-all font-bold">
            Sign Out
          </button>
        </div>
      </div>
    </div>) }

    

    </>
  );
}