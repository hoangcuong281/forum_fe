'use client'

import { useState, useEffect } from "react";

type Topic = {
    topicId: number;
    topicName: string;
    description: string;
};

type TopicPayload = {
    name: string;
    description: string;
};

const API_BASE = "http://localhost:8080/api/topics";

export default function Topic() {

    const [topics, setTopics] = useState<Topic[]>([]);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
    const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [newTopic, setNewTopic] = useState<TopicPayload>({
        name: "",
        description: ""
    });

    const fetchTopic = async () => {
        const res = await fetch(API_BASE, { credentials: 'include' });
        const data = await res.json();
        setTopics(data);
    };

    useEffect(() => {
        fetchTopic();
    }, []);

    const handleAdd = async () => {
        if (!newTopic.name.trim()) {
            alert("Tên chủ đề không được để trống");
            return;
        }

        await fetch(API_BASE, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTopic)
        });

        setAddModalOpen(false);
        setNewTopic({ name: "", description: "" });
        fetchTopic();
    };

    const openEdit = (topic: Topic) => {
        setEditingTopic(topic);
        setEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingTopic) return;
        const { name, value } = e.target;
        setEditingTopic({ ...editingTopic, [name]: value });
    };

    const handleSave = async () => {
        if (!editingTopic || !editingTopic.topicName.trim()) {
            alert("Tên chủ đề không được để trống");
            return;
        }

        await fetch(`${API_BASE}/${editingTopic.topicId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: editingTopic.topicName,
                description: editingTopic.description
            })
        });

        setEditModalOpen(false);
        setEditingTopic(null);
        fetchTopic();
    };

    const openDelete = (topic: Topic) => {
        setDeletingTopic(topic);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingTopic) return;

        await fetch(`${API_BASE}/${deletingTopic.topicId}`, {
            method: "DELETE",
            credentials: "include"
        });

        setDeleteModalOpen(false);
        setDeletingTopic(null);
        fetchTopic();
    };

    return (
        <div className="w-8/12 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">QUẢN LÝ DANH MỤC CHỦ ĐỀ</h1>

            <button
                className="px-3 py-1 border rounded self-start mb-5 text-white bg-green-500 hover:bg-green-600 font-bold"
                onClick={() => setAddModalOpen(true)}
            >
                Thêm
            </button>

            <table className="w-full table-auto border-collapse border border-slate-400">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Tên chủ đề</th>
                        <th className="border px-4 py-2">Mô tả</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.map(topic => (
                        <tr key={topic.topicId}>
                            <td className="border px-4 py-2">{topic.topicId}</td>
                            <td className="border px-4 py-2">{topic.topicName}</td>
                            <td className="border px-4 py-2">{topic.description}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => openDelete(topic)}
                                >
                                    Xoá
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                    onClick={() => openEdit(topic)}
                                >
                                    Sửa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {addModalOpen && (
                <Modal title="Thêm chủ đề" onClose={() => setAddModalOpen(false)}>
                    <input
                        className="input"
                        placeholder="Tên chủ đề"
                        value={newTopic.name}
                        onChange={e => setNewTopic({ ...newTopic, name: e.target.value })}
                    />
                    <textarea
                        className="input"
                        placeholder="Mô tả"
                        value={newTopic.description}
                        onChange={e => setNewTopic({ ...newTopic, description: e.target.value })}
                    />
                    <ModalActions onCancel={() => setAddModalOpen(false)} onConfirm={handleAdd} />
                </Modal>
            )}

            {editModalOpen && editingTopic && (
                <Modal title="Chỉnh sửa chủ đề" onClose={() => setEditModalOpen(false)}>
                    <input
                        className="input"
                        name="topicName"
                        value={editingTopic.topicName}
                        onChange={handleEditChange}
                    />
                    <textarea
                        className="input"
                        name="description"
                        value={editingTopic.description}
                        onChange={handleEditChange}
                    />
                    <ModalActions onCancel={() => setEditModalOpen(false)} onConfirm={handleSave} />
                </Modal>
            )}

            {deleteModalOpen && (
                <Modal title="Xoá chủ đề" onClose={() => setDeleteModalOpen(false)}>
                    <p>Bạn có chắc chắn muốn xoá chủ đề này?</p>
                    <ModalActions onCancel={() => setDeleteModalOpen(false)} onConfirm={handleDelete} danger />
                </Modal>
            )}
        </div>
    );
}


const Modal = ({ title, children, onClose }: any) => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
        <div className="bg-white p-6 rounded w-1/3 z-10">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="space-y-3">{children}</div>
        </div>
    </div>
);

const ModalActions = ({ onCancel, onConfirm, danger = false }: any) => (
    <div className="flex justify-end gap-2 mt-4">
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>Hủy</button>
        <button
            className={`px-4 py-2 rounded text-white ${danger ? "bg-red-600" : "bg-blue-600"}`}
            onClick={onConfirm}
        >
            Xác nhận
        </button>
    </div>
);
