'use client'

import { useState, useEffect } from "react";

type Topic = {
    id: number;
    name: string;
    description: string;
}

const topicsData: Topic[] = [
    { id: 1, name: "Học vụ - Thủ tục", description: "Các câu hỏi liên quan đến học vụ và thủ tục hành chính." },
    { id: 2, name: "Học tập - Môn học", description: "Các câu hỏi về chương trình học, môn học và tài liệu." },
    { id: 3, name: "CĐTN / KLTN", description: "Các câu hỏi về công tác đào tạo nghề và khóa luận tốt nghiệp." },
    { id: 4, name: "Học phí", description: "Các câu hỏi liên quan đến học phí và các khoản đóng góp." },
    { id: 5, name: "Hoạt động - CLB", description: "Các câu hỏi về các hoạt động ngoại khóa và câu lạc bộ." },
    { id: 6, name: "Khác", description: "Các câu hỏi khác không thuộc các chủ đề trên." },
];

export default function Topic(){

    const [topics, setTopics] = useState<Topic[]>([])
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        // fetch topics from API and set to state
    }, [])

    useEffect(() => {
        setTopics(topicsData);
    }, []);

    
    const openDelete = (topic: Topic) => {
        setDeleteModalOpen(true);
    }
    const closeDelete = () => {
        setDeleteModalOpen(false);
    }
    const handleDelete = () => {
        // delete topic
        closeDelete();
    }
    
    const openEdit = (topic: Topic) => {
        setEditingTopic(topic);
        setEditModalOpen(true);
    }
    const closeEdit = () => {
        setEditModalOpen(false);
        setEditingTopic(null);
    }
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editingTopic) {
            const { name, value } = e.target;
            setEditingTopic({ ...editingTopic, [name]: value });
        }
    }
    const handleSave = () => {
        // save edited topic
        closeEdit();
    }


    return(
        <div className="w-8/12 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">QUẢN LÝ DANH MỤC CHỦ ĐỀ</h1>
            <div className="w-full flex justify-center items-center">
                <table className="w-8/12 table-auto border-collapse border border-slate-400">
                    <thead>
                        <tr>
                            <th className="border border-slate-300 px-4 py-2">ID</th>
                            <th className="border border-slate-300 px-4 py-2">Tên chủ đề</th>
                            <th className="border border-slate-300 px-4 py-2">Mô tả</th>
                            <th className="border border-slate-300 px-4 py-2">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map((topic) => (
                            <tr key={topic.id}>
                                <td className="border border-slate-300 px-4 py-2">{topic.id}</td>
                                <td className="border border-slate-300 px-4 py-2">{topic.name}</td>
                                <td className="border border-slate-300 px-4 py-2">{topic.description}</td>
                                <td className="border border-slate-300 px-4 py-2">
                                    <button className="bg-(--main-lightRed) text-white px-2 py-1 rounded mr-2 hover:bg-red-600 cursor-pointer" onClick={() => openDelete(topic)}>Xoá</button>
                                    <button className="bg-(--main-blue) text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer" onClick={() => openEdit(topic)}>Sửa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    <div className="absolute inset-0 bg-black opacity-40" onClick={closeEdit}></div>
                    <div className="absolute top-1/4 bg-white p-6 rounded shadow-lg w-1/3 z-10">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa chủ đề</h2>
                        <label className="block mb-2">
                            Tên chủ đề:
                            <input
                                type="text"
                                className="w-full border border-gray-300 p-2 rounded mt-1"
                                defaultValue={editingTopic?.name || ''}
                            />
                        </label>
                        <label className="block mb-4">
                            Mô tả:
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded mt-1"
                                value={editingTopic?.description || ''}
                                onChange={handleEditChange}
                                defaultValue={editingTopic?.description || ''}
                                
                            />
                        </label>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 cursor-pointer"
                                onClick={closeEdit}
                            >
                                Hủy
                            </button>
                            <button 
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer" 
                                onClick={handleSave}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {(deleteModalOpen) && (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    <div className="absolute inset-0 bg-black opacity-40" onClick={closeDelete}></div>
                    <div className="absolute top-1/4 bg-white p-6 rounded shadow-lg w-1/3 z-10">
                        <h2 className="text-xl font-bold mb-4">Xoá chủ đề</h2>
                        <p className="mb-4">Bạn có chắc chắn muốn xoá chủ đề này không?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400 cursor-pointer"
                                onClick={closeDelete}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                                onClick={handleDelete}
                            >
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}