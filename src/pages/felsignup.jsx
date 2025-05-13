import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // adjust path as needed

function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    aadhar: '',
    phone: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleChange = (e) => {
    setFormError('');
    setFormSuccess('');
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCred.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        phone: formData.phone,
        aadhar: formData.aadhar,
      });

      setFormSuccess('User registered successfully!');
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        aadhar: '',
        phone: '',
      });
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/img/background rectangle.png')",
        backgroundColor: "black",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-green-900/80 backdrop-blur-xs z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl p-12 rounded-3xl w-120 sm:w-128 lg:w-144 flex flex-col space-y-6"
      >
        <h2 className="text-white text-4xl font-semibold text-center mb-8">Create Your Account</h2>

        {formError && <p className="text-red-400 text-center">{formError}</p>}
        {formSuccess && <p className="text-green-300 text-center">{formSuccess}</p>}

        <Input label="Username or Email" name="email" value={formData.email} onChange={handleChange} />
        <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
        <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
        <Input label="Aadhar Card" name="aadhar" value={formData.aadhar} onChange={handleChange} />
        <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-gradient-to-r from-green-900 to-green-600 text-white font-semibold shadow-lg hover:shadow-[0_0_20px_#FFD700] transition-all"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

function Input({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="flex flex-col space-y-3">
      <label htmlFor={name} className="text-white text-lg font-medium">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="p-4 rounded-full bg-transparent border border-white text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        required
      />
    </div>
  );
}

export default App;
