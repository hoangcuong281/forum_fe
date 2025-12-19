'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react";

type ClassType = {
    classId: string;
    className: string;
    advisorId: string;
    academicYear: string;
}

export default function Class(){
    const [classes, setClasses] = useState<ClassType[]>([]);
    const [newClass, setNewClass] = useState<ClassType>({
        classId: "",
        className: "",
        advisorId: "",
        academicYear: ""
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
    const [editData, setEditData] = useState({
        className: "",
        advisorId: "",
        academicYear: ""
    });

    const fetchClasses = async () => {
        try{
            const res = await fetch('http://localhost:8080/api/classes',{
                credentials: 'include',
            })
            const data: ClassType[] = await res.json();
            setClasses(data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchClasses();
    }, []);

    const openEditModal = (cls: ClassType) => {
        setSelectedClass(cls);
        setEditData({
            className: cls.className,
            advisorId: cls.advisorId,
            academicYear: cls.academicYear
        });
        setShowEditModal(true);
    }

    const handleSave = async () => {
        if (!selectedClass) return;

        try {
            const res = await fetch(`http://localhost:8080/api/classes/${selectedClass.classId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(editData)
            });

            if (!res.ok) throw new Error(`Lỗi khi cập nhật: ${res.status}`);

            const updatedClass: ClassType = await res.json();
            setClasses(prev => prev.map(c => c.classId === updatedClass.classId ? updatedClass : c));
            setShowEditModal(false);
        } catch (err) {
            console.error(err);
            alert("Cập nhật lớp thất bại. Vui lòng thử lại.");
        }
    }

    const openDeleteModal = (cls: ClassType) => {
        setSelectedClass(cls);
        setShowDeleteModal(true);
    }

    const handleAdd = async () => {
        console.log(newClass)
        try {
            const res = await fetch(`http://localhost:8080/api/classes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newClass)
            });

            if (!res.ok) throw new Error(`Lỗi khi thêm: ${res.status}`);
            setNewClass({
                classId: "",
                className: "",
                advisorId: "",
                academicYear: ""
            });
            setShowAddModal(false);
            fetchClasses();
        } catch (err) {
            console.error(err);
            alert("Thêm lớp thất bại. Vui lòng thử lại.");
        }
    }
    const handleDelete = async () => {
        if (!selectedClass) return;

        try {
            const res = await fetch(`http://localhost:8080/api/classes/${selectedClass.classId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error(`Lỗi khi xóa: ${res.status}`);

            // Cập nhật state classes sau khi xóa
            setClasses(prev => prev.filter(c => c.classId !== selectedClass.classId));
            setShowDeleteModal(false);
        } catch (err) {
            console.error(err);
            alert("Xóa lớp thất bại. Vui lòng thử lại.");
        }
    }

    return(
        <div className="w-8/12 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">QUẢN LÝ LỚP HỌC - CVHT PHỤ TRÁCH</h1>
            <div className="w-full flex justify-center items-center">
                <div className="w-2/5 flex flex-col justify-center items-center ">
                    <span className="mb-5 font-bold text-xl">Danh sách lớp</span>
                    <button 
                        className="px-2 py-1 border rounded self-start mb-5 cursor-pointer text-white bg-green-500 hover:bg-green-600 font-bold"
                        onClick={()=>setShowAddModal(true)}
                    >
                        Thêm
                    </button>
                    {classes.map((cls) => (
                        <Card key={cls.classId} className="w-full mb-4 px-10 flex flex-row">
                            <div className="flex flex-1 flex-col items-start justify-center">
                                <div>{cls.classId} - {cls.className}</div>
                                <div>CVHT: {cls.advisorId} Năm học: {cls.academicYear}</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant='outline' className="cursor-pointer" onClick={()=>openEditModal(cls)}>Chỉnh sửa</Button>
                                <Button variant='outline' className="cursor-pointer" onClick={()=>openDeleteModal(cls)}>Xoá</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black opacity-75"
                        onClick={() => setShowAddModal(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-6 w-96 z-10 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Thêm lớp mới</h2>

                            <div className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Mã lớp"
                                    value={newClass.classId}
                                    onChange={e =>
                                        setNewClass(prev => ({ ...prev, classId: e.target.value }))
                                    }
                                    className="border p-2 rounded"
                                />

                                <input
                                    type="text"
                                    placeholder="Tên lớp"
                                    value={newClass.className}
                                    onChange={e =>
                                        setNewClass(prev => ({ ...prev, className: e.target.value }))
                                    }
                                    className="border p-2 rounded"
                                />

                                <input
                                    type="text"
                                    placeholder="Mã CVHT"
                                    value={newClass.advisorId}
                                    onChange={e =>
                                        setNewClass(prev => ({ ...prev, advisorId: e.target.value }))
                                    }
                                    className="border p-2 rounded"
                                />

                                <input
                                    type="text"
                                    placeholder="Năm học"
                                    value={newClass.academicYear}
                                    onChange={e =>
                                        setNewClass(prev => ({ ...prev, academicYear: e.target.value }))
                                    }
                                    className="border p-2 rounded"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-5">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAddModal(false)}
                                    className="cursor-pointer"
                                >
                                    Huỷ
                                </Button>

                                <Button
                                    className="cursor-pointer"
                                    onClick={handleAdd}
                                >
                                    Lưu
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}


            {/* Edit Modal */}
            {showEditModal && selectedClass && (
                <>
                    <div
                        className="fixed inset-0 bg-black opacity-75"
                        onClick={()=>setShowEditModal(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-6 w-96 z-10 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Chỉnh sửa lớp {selectedClass.classId}</h2>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Tên lớp"
                                    value={editData.className}
                                    onChange={e => setEditData(prev => ({...prev, className: e.target.value}))}
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Mã CVHT"
                                    value={editData.advisorId}
                                    onChange={e => setEditData(prev => ({...prev, advisorId: e.target.value}))}
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Năm học"
                                    value={editData.academicYear}
                                    onChange={e => setEditData(prev => ({...prev, academicYear: e.target.value}))}
                                    className="border p-2 rounded"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-5">
                                <Button variant="outline" onClick={()=>setShowEditModal(false)}>Huỷ</Button>
                                <Button onClick={handleSave}>Lưu</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedClass && (
                <>
                    <div
                        className="fixed inset-0 bg-black opacity-75"
                        onClick={()=>setShowDeleteModal(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-6 w-96 z-10 shadow-lg text-center">
                            <h2 className="text-xl font-bold mb-4">Xác nhận xóa lớp {selectedClass.classId}</h2>
                            <p className="mb-5">Bạn có chắc chắn muốn xóa lớp này không? Hành động này không thể hoàn tác.</p>
                            <div className="flex justify-center gap-3">
                                <Button variant="outline" onClick={()=>setShowDeleteModal(false)}>Huỷ</Button>
                                <Button variant="destructive" onClick={handleDelete}>Xác nhận</Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
