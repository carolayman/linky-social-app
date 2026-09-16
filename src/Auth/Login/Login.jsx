import React, { useContext, useState } from "react";
import { Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye , FaEyeSlash} from "react-icons/fa";
import { ImSpinner6 } from "react-icons/im";
import ErrorMsg from "../../Components/ErrorMsg/ErrorMsg";
import Swal from "sweetalert2";
import axios from "axios";
import { Link , useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function Login() {

  let {setUserLogin} = useContext(UserContext)

  const navigate = useNavigate()
  const schema = z.object({
      email:z.string().email("invalid mail"),
      password: z.string().min(8, "Password must be at least 8 characters")
      .regex( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,"Wrong Password" )
    })

  const form = useForm(
    { // same at the api
      defaultValues:{
        email:"",
        password:"",
      },
      resolver:zodResolver(schema),
      mode:"all"
    }
  )

  let {register , handleSubmit , formState , watch} = form 

  const [isLoading,setIsLoading] = useState(false)
  const [showPassword,setShowPassword] = useState(false)
  const passwordValue = watch('password')


  async function handleLogin(values) {
    try {
      setIsLoading(true)
      const { data } = await axios.post('https://route-posts.routemisr.com/users/signIN',values);
      console.log(data)
      const token = data.data.token;
     localStorage.setItem("userToken", token);
     setUserLogin(token);
      Swal.fire({
        title: "Success!",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          setTimeout(() => {
            navigate("/home");
          }, 200); 
        }
      });

    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <>
     <title>Login</title>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white p-8 text-center md:w-[80%] lg:w-1/2 m-auto rounded-2xl">
            <h2 className="text-3xl font-bold text-center text-sky-500 mb-8"> Login Form</h2> 
            
              <div>
                  <Input {...register('email')} type="email" aria-label="email" className="w-full mt-4 h-12 rounded-xl border-2 border-default-200 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50" placeholder="Enter your email"/>
                  <ErrorMsg error={formState.errors.email}/>
                  <div className="relative">
                    {passwordValue && <span onClick={()=>setShowPassword(!showPassword)} className="z-50 absolute top-8 right-4 text-sky-500 cursor-pointer">{showPassword ? <FaEye/> : <FaEyeSlash />}</span>}
                    <Input {...register('password')} type={showPassword ? "text":"password"} aria-label="password" className="z-1 w-full mt-4 h-12 rounded-xl border-2 border-default-200 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50" placeholder="Enter your password"/>
                    <ErrorMsg error={formState.errors.password}/>
                 </div>
                  <div>
                     <button type='submit' disabled={isLoading} className="mt-4 w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-500 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center">{isLoading ? <ImSpinner6 className="animate-spin text-2xl" />: "Login"}</button>
                     <span className="block mt-2 text-gray-500">don't have an account ? <Link to={'/'} className='text-sky-500'>Register Now</Link></span>
                  </div>
              </div>
            </div>
        </div>
      </form>
    </>
  );
}


