'use client'

import { useState, useEffect } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    classID: number;
}

export default function Register(){
    
    const [user, setUser] = useState<User | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        // handle registration logic here
    }

    return(
        <div className="w-8/12 flex justify-center items-center">
            <form onSubmit={submit}>
                <div className="p-6 w-full">
                    <h1 className="text-2xl font-bold mb-4">ĐĂNG KÝ TÀI KHOẢN MỚI</h1>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Họ và tên:</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Email:</label>
                        <input type="email" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Mật khẩu:</label>
                        <input type="password" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Vai trò:</label>
                        <select className="w-full p-2 border border-gray-300 rounded">
                            <option value="sinhvien">Sinh viên</option>
                            <option value="cvht">CVHT</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Lớp:</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Đăng ký</button>
                </div>
            </form>
        </div>
    )
}