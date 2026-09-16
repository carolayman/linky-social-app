import React, { useState } from "react";
import { Alert, Input , Button } from "@heroui/react";
import { FormState, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye , FaEyeSlash} from "react-icons/fa";
import { ImSpinner6 } from "react-icons/im";
import ErrorMsg from "../../Components/ErrorMsg/ErrorMsg";
import Swal from "sweetalert2";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate()
  const schema = z.object({
      name:z.string().min(3,"name must be at least 3 characters").max(20,"name must be at most 15 characters"),
      
      username:z.string().min(3,"username must be at least 3 characters").max(15,"username must be at most 15 characters"),
      
      email:z.string().email("invalid mail"),
      
      // date (4digits-2digits-2digits)
      // make your own regex {start with /^ - end with $/}
      // handle future dates 
      // refine function بترجع القيمه اللي في الاوبجيكت عشان تقارن او غيره 
      // refine function take arrow function inside it the object itself
      dateOfBirth:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"invalid date").refine((date)=>{
        // Date has year - mon - day - hour - sec - ms i want it to match my regex
        const userDate = new Date (date) // user date اللي المستخدم دخلها
        const now = new Date()
        now.setHours(0,0,0,0)
        return userDate < now 
      } , "can't enter future date"),
      
      // enum() accepts an array of strings.
      // The value must be one of the specified options.  
      gender: z.enum(["female", "male"], {message: "Gender must be either male or female",}),
      
      // passsword same validation as backend
      password: z.string().min(8, "Password must be at least 8 characters")
      .regex( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,"Password must contain an uppercase letter, a lowercase letter, a number, and a special character." ) , 
      
      // in this refine send the whole object to compare 
      rePassword:z.string()
  }).refine((object)=>object.password === object.rePassword
      ,{message:"password and rePassword must be same"
      ,path:["rePassword"]})// عايز الرساله تظهر فين حدد المسار 

  const form = useForm(
    { // same at the api
      defaultValues:{
        name:"",
        username:"",
        email:"",
        dateOfBirth:"",
        gender:"",
        password:"",
        rePassword:"",
      },
      resolver:zodResolver(schema),
      mode:"all"
    }
  )

  let {register , handleSubmit , formState , watch} = form 
  // let {name , onBlur , onChange , ref} = register('name')

  const [isLoading,setIsLoading] = useState(false)
  const [showPassword,setShowPassword] = useState(false)
  const [showRePassword,setShowRePassword] = useState(false)
  const passwordValue = watch('password')
  const rePasswordValue = watch('rePassword')


  async function handleRegister(values) {
    try {
      setIsLoading(true)
      const { data } = await axios.post("https://route-posts.routemisr.com/users/signup",values);
      console.log(data);
      Swal.fire({
        title: "Success!",
        text: data.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          setTimeout(() => {
            navigate("/login");
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
     <title>Register</title>
      <form onSubmit={handleSubmit(handleRegister)}>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white p-8 text-center md:w-[80%] lg:w-1/2 m-auto rounded-2xl">
            <h2 className="text-3xl font-bold text-center text-sky-500 mb-8"> Register Form</h2> 
            
              <div>
                  <Input {...register('name')} type="text" aria-label="name" className="w-full mt-4 h-12 rounded-xl border-2 border-default-200 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50" placeholder="Enter your name"/>
                  <ErrorMsg error={formState.errors.name}/>

                  <Input {...register('username')} type="text" aria-label="username" className="w-full mt-4 h-12 rounded-xl border-2 border-default-200 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50" placeholder="Enter your username"/>
                  <ErrorMsg error={formState.errors.username}/>

                  <Input {...register('email')} type="email" aria-label="email" className="w-full mt-4 h-12 rounded-xl border-2 border-default-200 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50" placeholder="Enter your email"/>
                  <ErrorMsg error={formState.errors.email}/>
                  
                  <div className="md:flex gap-4 mt-4">
                    <div className="flex flex-col w-full md:w-1/2">
                        <Input {...register('dateOfBirth')} type="date" aria-label="dateOfBirth" className="w-full mt-4 h-12 rounded-xl border-2 border-default-200 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50" placeholder="Enter your date of birth"/>
                        <ErrorMsg error={formState.errors.dateOfBirth}/>
                    </div>
                      
                      <div className="flex flex-col w-full md:w-1/2">
                          <select {...register('gender')} name="gender" defaultValue="" className=" mt-4 h-12 rounded-xl border-2 border-default-100 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50">
                            <option className="text-gray-400" value="" disabled>
                              Select Gender
                            </option>
                            <option className="text-sky-400" value="female">Female</option>
                            <option className="text-blue-400" value="male">Male</option>
                          </select>
                          <ErrorMsg error={formState.errors.gender}/>
                      </div>
                  </div>          
                  <div className="relative">
                    {passwordValue && <span onClick={()=>setShowPassword(!showPassword)} className="z-50 absolute top-8 right-4 text-sky-500 cursor-pointer">{showPassword ? <FaEye/> : <FaEyeSlash />}</span>}
                    <Input {...register('password')} type={showPassword ? "text":"password"} aria-label="password" className="z-1 w-full mt-4 h-12 rounded-xl border-2 border-default-200 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50" placeholder="Enter your password"/>
                    <ErrorMsg error={formState.errors.password}/>
                 </div>

                  <div className="relative">
                    {rePasswordValue &&<span onClick={()=>setShowRePassword(!showRePassword)} className="z-50 absolute top-8 right-4 text-sky-500 cursor-pointer">{showRePassword ? <FaEye/> : <FaEyeSlash />}</span>}
                    <Input {...register('rePassword')} type={showRePassword ? "text":"password"}  aria-label="repassword" className="w-full mt-4 h-12 rounded-xl border-2 border-default-200 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50" placeholder="Enter your password"/>          
                    <ErrorMsg error={formState.errors.rePassword}/>
                  </div>
                  
                  <div>
                    <button disabled={isLoading} className="mt-4 w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center">{isLoading ? <ImSpinner6 className="animate-spin text-2xl" />: "Register"}</button>
                    <span className="block mt-2 text-gray-500"> have an account ? <Link to={'/login'} className='text-sky-500'>Login Now</Link></span>
                  </div>
              </div>
            </div>
        </div>
      </form>
    </>
  );
}

// MAPPING FOR THE FORM ( OR MADE COMPONENT )

// const fields = [
//   {name:"name", type:"text ", placeholder:"Enter your name"},
//   {name:"username", type:"text ", placeholder:"Enter your username"},
//   {name:"email", type:"email ", placeholder:"Enter your email"},
// ]

// {fields.map((field)=>
// { return 
// <>
// <Input key={field.name} {...register(field.name)} type={field.type} className="w-full mt-4 h-12 rounded-xl border-2 border-default-200 bg-transparent text-sm text-gray-700 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-200 hover:bg-gray-50" placeholder={FiCornerLeftDown.placeholder}/>)}
// <ErrorMsg error={formState.errors.[field.name]}/>
// </> }