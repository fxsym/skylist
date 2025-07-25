import { useContext, useEffect, useState } from "react";
import CenterContainer from "../layouts/CenterContainer";
import { LoaderRing } from "../componenets/Loader";
import { Link, useNavigate } from "react-router-dom";
import { checkUsername } from "../utils/userApi";

import CreateAccount from "../assets/images/CreateAccount.png"
import { register } from "../services/authServices";
import { AuthContext } from "../context/AuthContext";
import { deviceInfo } from "../utils/loginUtils";


export default function Register() {
    const [name, setName] = useState()
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [takenUsername, setTakenUsername] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const { login } = useContext(AuthContext);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const device = deviceInfo();
        console.log(name, username, email, password)

        try {
            const response = await register(name, username, email, password)
            console.log(response)
            if (response.status = 201) {
                navigate('/verify')
                await login(username, password, device)
            }
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }

    }

    const checkReqUsername = async () => {
        try {
            const response = await checkUsername(username)
            setTakenUsername(response.data.taken)
            console.log(response.data.taken)
        } catch {

        }
    }

    useEffect(() => {
        checkReqUsername()
    }, [username])

    return (
        <>
            <CenterContainer>
                <div className="flex items-center lg:justify-evenly lg:px-26 overflow-hidden">
                    <img src={CreateAccount} alt="" className="hidden lg:block w-65 sm:w-100 lg:w-1/2" />
                    <div className="font-[Poppins] w-120 flex flex-col gap-6 sm:w-160 lg:w-2/3 p-14 ">
                        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Create account </h1>
                        <p className="text-sm text-gray-500 sm:text-lg lg:text-xl">You must have an account first to be able to log in. Create your account and save the activities you will do, access from anywhere and anytime.</p>
                        <div className="">
                            <form action="" className="flex flex-col items-center gap-2" onSubmit={handleSubmit}>
                                <input type="text" placeholder="| Name" className="input-form" name="name" onChange={(e) => setName(e.target.value)} required />
                                <input type="text" placeholder="| Username" className="input-form" name="username" onChange={(e) => setUsername(e.target.value)} required />
                                {username && (
                                    <p className={`text-sm ${takenUsername ? 'text-red-500' : 'text-green-500'}`}>
                                        {takenUsername ? 'Username already exist' : ''}
                                    </p>
                                )}
                                <input type="email" placeholder="| Email" className="input-form" name="email" onChange={(e) => setEmail(e.target.value)} required />
                                <input type="password" placeholder="| New password" className="input-form" name="password" onChange={(e) => setPassword(e.target.value)} required />
                                {loading ? <LoaderRing /> : ""}
                                <button className="bg-sky-500 py-4 w-full rounded-xl mt-4 text-white cursor-pointer hover:bg-sky-800 transition-all text-md sm:text-lg lg:text-xl">Create Account</button>
                                {error && <p>{error}</p>}
                            </form>
                            <div className="flex justify-center items-center mt-8">
                                <div className="w-[40%] h-[2px] bg-gray-500"></div>
                                <p className="px-2 text-sm text-gray-500">Or</p>
                                <div className="w-[40%] h-[2px] bg-gray-500"></div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <p className="sm:text-md *:lg:text-lg">Already have account ? <Link to="/login" className=" underline cursor-pointer text-sky-500 hover:text-sky-800 transition-all  sm:text-md lg:text-lg">Login</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </CenterContainer>
        </>
    )
}