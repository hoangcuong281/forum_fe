'use client'

import { useState, useEffect } from "react";

type User = {
    userId: number;
    fullName: string;
    email: string;
    password: string;
    role: string;
    classID: number;
}

export default function Register(){
    
    const [user, setUser] = useState<User | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(user);
        try {
            const res = await fetch('http://localhost:8080/api/auth/register',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            });
            console.log(res);
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        } as User));
    }

    return(
        <div className="w-8/12 flex justify-center items-center">
            <form onSubmit={submit}>
                <div className="p-6 w-full">
                    <h1 className="text-2xl font-bold mb-4">ĐĂNG KÝ TÀI KHOẢN MỚI</h1>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Mã sinh viên:</label>
                        <input type="text" name="userId" className="w-full p-2 border border-gray-300 rounded" onChange={onChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Họ và tên:</label>
                        <input type="text" name="fullName" className="w-full p-2 border border-gray-300 rounded" onChange={onChange} />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Email:</label>
                        <input type="email" name="email" className="w-full p-2 border border-gray-300 rounded" onChange={onChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Mật khẩu:</label>
                        <input type="password" name="password" className="w-full p-2 border border-gray-300 rounded" onChange={onChange} />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Vai trò:</label>
                        <select name="role" className="w-full p-2 border border-gray-300 rounded" onChange={onChange}>
                            <option value="sinhvien">Sinh viên</option>
                            <option value="cvht">CVHT</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Lớp:</label>
                        <input type="text" name="classId" className="w-full p-2 border border-gray-300 rounded" onChange={onChange} />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Đăng ký</button>
                </div>
            </form>
        </div>
    )
}