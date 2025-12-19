'use client'

import { useState } from "react";

type User = {
    userId: string | "";
    fullName: string;
    email: string;
    password: string;
    role: string;
    classID: string | "";
}

const initialUser: User = {
    userId: "",
    fullName: "",
    email: "",
    password: "",
    role: "sinhvien",
    classID: ""
};

export default function Register() {

    const [user, setUser] = useState<User>(initialUser);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);

        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (!res.ok) {
                throw new Error("Đăng ký thất bại");
            }

            setSuccess("Đăng ký tài khoản thành công!");
            setUser(initialUser); // reset form

        } catch (err) {
            setError("Đăng ký thất bại, vui lòng thử lại");
            console.error(err);
        }
    }

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <div className="w-8/12 flex justify-center items-center">
            <form className="w-2/5" onSubmit={submit}>
                <div className="p-6 w-full">
                    <h1 className="text-2xl font-bold mb-4">
                        ĐĂNG KÝ TÀI KHOẢN MỚI
                    </h1>

                    {success && (
                        <div className="mb-4 text-green-600 font-medium">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Mã sinh viên:</label>
                        <input
                            type="text"
                            name="userId"
                            value={user.userId}
                            className="w-full p-2 border rounded"
                            onChange={onChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Họ và tên:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={user.fullName}
                            className="w-full p-2 border rounded"
                            onChange={onChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            className="w-full p-2 border rounded"
                            onChange={onChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Mật khẩu:</label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            className="w-full p-2 border rounded"
                            onChange={onChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Vai trò:</label>
                        <select
                            name="role"
                            value={user.role}
                            className="w-full p-2 border rounded"
                            onChange={onChange}
                        >
                            <option value="sinhvien">Sinh viên</option>
                            <option value="cvht">CVHT</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Lớp:</label>
                        <input
                            type="text"
                            name="classID"
                            value={user.classID}
                            className="w-full p-2 border rounded"
                            onChange={onChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Đăng ký
                    </button>
                </div>
            </form>
        </div>
    );
}
