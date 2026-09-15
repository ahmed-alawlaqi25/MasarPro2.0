import { User2, Mail } from 'lucide-react';
import React from 'react'
import { Link} from "react-router";

const Login = () => {

  
  const query = new URLSearchParams(window.location.search)
  const urlState = query.get('state')
  const [state, setState] = React.useState(urlState || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
            <div className='flex items-center justify-center min-h-screen bg-gray-50'>

              <div 
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-600/30 via-sky-500/10 to-transparent via-50%" 
                aria-hidden="true"
              />
              <form onSubmit={handleSubmit} className="relative sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                  <Link to="/" className=' flex justify-center mt-5'>
                    <img
                      src="/logoNoText.png"
                      alt="MasarPro Logo"
                      className="w-[170px] object-contain"
                    />
                  </Link>
                  <h1 className="text-gray-900 text-3xl mt-6 font-medium">{state === "login" ? "Login" : "Sign up"}</h1>
                  <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>
                  {state !== "login" && (
                      <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                          <User2 size={16} color='#6B7280'/>
                          <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />
                      </div>
                  )}
                  <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <Mail size={16} color='#6B7280'/>
                      <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-linear-to-r from-[#0fc2b3] to-[#114f83] hover:opacity-90 transition-opacity">
                      {state === "login" ? "Login" : "Sign up"}
                  </button>
                  <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href={`login?state=${state}`} className="text-indigo-500 hover:underline">click here</a></p>
              </form>
            </div>
    )
}

export default Login