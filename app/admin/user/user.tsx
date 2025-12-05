'use client'

import React from "react";
import { useEffect, useState } from "react";

export default function User(){
    type Role = 'sinhvien' | 'cvht'

    type User = {
        id: string
        name: string
        email: string
        role: Role
    }

    const [users, setUsers] = useState<User[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [editing, setEditing] = useState<User | null>(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<Role>('sinhvien')

    useEffect(() => {
        const raw = localStorage.getItem('users_simple')
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as User[]
                setUsers(parsed)
            } catch (e) {
                console.error('Failed to parse users_simple', e)
            }
        } else {
            const seed: User[] = [
                { id: cryptoRandomId(), name: 'Nguyen Van A', email: 'a@example.com', role: 'sinhvien' },
                { id: cryptoRandomId(), name: 'Tran Thi B', email: 'b@example.com', role: 'cvht' }
            ]
            setUsers(seed)
            localStorage.setItem('users_simple', JSON.stringify(seed))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('users_simple', JSON.stringify(users))
    }, [users])

    function cryptoRandomId() {
        try {
            return crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
        } catch {
            return Date.now().toString(36)
        }
    }

    function openCreate(){
        setEditing(null)
        setName('')
        setEmail('')
        setRole('sinhvien')
        setIsOpen(true)
    }

    function openEdit(u: User){
        setEditing(u)
        setName(u.name)
        setEmail(u.email)
        setRole(u.role)
        setIsOpen(true)
    }

    function onSave(){
        if (!name.trim() || !email.trim()){
            alert('Vui lòng nhập tên và email')
            return
        }

        if (editing){
            const updated = users.map(u => u.id === editing.id ? { ...u, name: name.trim(), email: email.trim(), role } : u)
            setUsers(updated)
            setIsOpen(false)
            setEditing(null)
        } else {
            const newUser: User = { id: cryptoRandomId(), name: name.trim(), email: email.trim(), role }
            setUsers(prev => [newUser, ...prev])
            setIsOpen(false)
        }
    }

    function onDelete(id: string){
        if (!confirm('Xóa người dùng này?')) return
        setUsers(prev => prev.filter(u => u.id !== id))
    }

    function toggleRole(u: User){
        const newRole: Role = u.role === 'sinhvien' ? 'cvht' : 'sinhvien'
        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x))
    }

    return (
        <div className="w-8/12 flex justify-center items-center flex-col">
            <h1 className="text-2xl font-bold mb-4">QUẢN LÝ NGƯỜI DÙNG</h1>
            <div className="p-6 w-full">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <button onClick={openCreate} className="px-3 py-1 rounded bg-blue-600 text-white">Tạo người dùng</button>
                    </div>
                </div>

                <div className="bg-white rounded shadow overflow-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-2">Tên</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Vai trò</th>
                                <th className="px-4 py-2">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr><td colSpan={4} className="p-4">Không có người dùng</td></tr>
                            )}
                            {users.map(u => (
                                <tr key={u.id} className="border-t">
                                    <td className="px-4 py-2">{u.name}</td>
                                    <td className="px-4 py-2">{u.email}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-sm ${u.role === 'sinhvien' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {u.role === 'sinhvien' ? 'Sinh viên' : 'CVHT'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(u)} className="px-2 py-1 bg-gray-200 rounded">Sửa</button>
                                            <button onClick={() => toggleRole(u)} className="px-2 py-1 bg-indigo-200 rounded">Chuyển vai trò</button>
                                            <button onClick={() => onDelete(u.id)} className="px-2 py-1 bg-red-200 rounded">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded shadow-lg w-11/12 max-w-lg p-6">
                            <h3 className="text-lg font-medium mb-4">{editing ? 'Chỉnh sửa người dùng' : 'Tạo người dùng'}</h3>

                            <div className="mb-3">
                                <label className="block text-sm mb-1">Tên</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm mb-1">Email</label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm mb-1">Vai trò</label>
                                <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full border px-3 py-2 rounded">
                                    <option value="sinhvien">Sinh viên</option>
                                    <option value="cvht">CVHT</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button onClick={() => { setIsOpen(false); setEditing(null) }} className="px-3 py-1 rounded border">Hủy</button>
                                <button onClick={onSave} className="px-3 py-1 rounded bg-blue-600 text-white">Lưu</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    
    )
}
