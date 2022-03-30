import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'


export default function Register ({ currentUser, setCurrentUser }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        passwordCheck: ''
    })
    const [msg, setMsg] = useState('')

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (form.password === form.passwordCheck) {
            // remove unneeded data in the form pre-request
            delete form.passwordCheck
            try {
                const response = await axios.post(process.env.REACT_APP_SERVER_URL+'/api-v1/users/register', form)
                const { token } = response.data
                localStorage.setItem('jwt', token)
                const decoded = jwt_decode(token)
                setCurrentUser(decoded)
            } catch (err) {
                if (err.response.status === 409) {
                    setMsg(err.response.data.msg)
                }
                console.log(err)
            }
        } else setMsg('passwords do not match')
    }

    if (currentUser) return <Navigate to='/feed' />

    return (
        <div className='bg-light margin-lr'>
            <h2 className='sign-up'>Sign Up</h2>
            <p>{msg ? `message from server: ${msg}` : ''}</p>
            <form onSubmit={handleFormSubmit}>
                <div className='column'>

                    <label htmlFor="name">Name:</label>
                    <input id="name" type="text" placeholder='Enter name here...' autoComplete="off" onChange={e => setForm({...form, name: e.target.value})} value={form.name} required />

                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" placeholder='Enter email here...' autoComplete="off" onChange={e => setForm({...form, email: e.target.value})} value={form.email} required />
                    
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" onChange={e => setForm({...form, password: e.target.value})} value={form.password} required />

                    <label htmlFor="passwordCheck">Confirm Password:</label>
                    <input id="passwordCheck" type="password" onChange={e => setForm({...form, passwordCheck: e.target.value})} value={form.passwordCheck} required />

                    <button className='btn' type="submit">Create My Account</button>

                </div>
            </form>
        </div>
    )
}