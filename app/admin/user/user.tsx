'use client'

import { useEffect, useState } from "react";

type Role = 'ADMIN' | 'ADVISOR' | 'STUDENT' | null;

type User = {
    userId: string;
    fullName: string;
    email: string;
    role: Role;
    classId: string | null;
};

export default function User() {

    const [users, setUsers] = useState<User[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null); // user muốn xóa
    const [showModal, setShowModal] = useState(false);

    const fetchUser = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/users', {
                credentials: "include",
            });
            const data: User[] = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const onDeleteClick = (user: User) => {
        setDeleteTarget(user);
        setShowModal(true);
    };

    
    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            const res = await fetch(`http://localhost:8080/api/users/${deleteTarget.userId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Xóa người dùng thất bại");
            }

            setUsers(prev => prev.filter(u => u.userId !== deleteTarget.userId));
            setDeleteTarget(null);
            setShowModal(false);

        } catch (err) {
            console.error(err);
            alert("Xóa người dùng thất bại, vui lòng thử lại");
        }
    };

    const cancelDelete = () => {
        setDeleteTarget(null);
        setShowModal(false);
    };

    const renderRole = (role: Role) => {
        switch (role) {
            case 'ADMIN':
                return <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-700">Admin</span>;
            case 'ADVISOR':
                return <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">CVHT</span>;
            case 'STUDENT':
                return <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">Sinh viên</span>;
            default:
                return <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-600">Chưa phân quyền</span>;
        }
    };

    return (
        <div className="w-8/12 flex justify-center items-center flex-col">
            <h1 className="text-2xl font-bold mb-4">QUẢN LÝ NGƯỜI DÙNG</h1>

            <div className="p-6 w-full">
                <div className="bg-white rounded shadow overflow-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-2">Mã</th>
                                <th className="px-4 py-2">Tên</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Vai trò</th>
                                <th className="px-4 py-2">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center">
                                        Không có người dùng
                                    </td>
                                </tr>
                            )}

                            {users.map(u => (
                                <tr key={u.userId} className="border-t">
                                    <td className="px-4 py-2">{u.userId}</td>
                                    <td className="px-4 py-2">{u.fullName}</td>
                                    <td className="px-4 py-2">{u.email}</td>
                                    <td className="px-4 py-2">{renderRole(u.role)}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => onDeleteClick(u)}
                                            className="px-2 py-1 bg-red-200 rounded hover:bg-red-300 cursor-pointer"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Modal Xác nhận xóa */}
            {showModal && deleteTarget && (
                <>
                    <div
                        className="absolute inset-0 bg-black opacity-75"
                    />
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow w-96">
                            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
                            <p className="mb-4">Bạn có chắc muốn xóa người dùng <strong>{deleteTarget.fullName}</strong> không?</p>
                            <div className="flex justify-end gap-2">
                                <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer">Hủy</button>
                                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
