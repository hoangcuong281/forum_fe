'use client'

import React from "react";
import { useEffect, useState } from "react";

import { SearchBar } from "@/components/search-bar"

type Question = {
    id: number;
    title: string;
    content: string;
    userID: number;
    topicID: number;
    createDate: string;
    status: string;
}

type Answer = {
    id: number;
    questionID: number;
    content: string;
    userID: number;
    answerDate: string;
}

const questionList: Question[] = [
    { id: 1, title: "", content: "Câu hỏi 1", userID: 4158, topicID:1, createDate:"", status: "Answered" },
    { id: 2, title: "", content: "Câu hỏi 2", userID: 4358, topicID:2, createDate:"", status: "Processing" },
    { id: 3, title: "", content: "Câu hỏi 3", userID: 4258, topicID:3, createDate:"", status: "New" },
    { id: 4, title: "", content: "Câu hỏi 4", userID: 4458, topicID:4, createDate:"", status: "Closed" },
];

const answerList: Answer[] = [
    { id: 1, questionID: 1, content: "Câu trả lời 1", userID: 1001, answerDate: "" },
    { id: 2, questionID: 1, content: "Câu trả lời 2", userID: 1002, answerDate: "" },
    { id: 3, questionID: 2, content: "Câu trả lời 3", userID: 1001, answerDate: "" },
];

export default function Question(){

    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        setQuestions(questionList);
    }, []);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

    const selectQuestion = (id: number) => {
        // toggle selection
        setSelectedQuestionId((prev) => (prev === id ? null : id));
    };

    const openEditor = (e: React.MouseEvent, q: Question) => {
        e.stopPropagation();
        setEditingQuestion({ ...q });
    };

    const closeEditor = () => setEditingQuestion(null);

    const handleEditChange = (field: keyof Question, value: string) => {
        if (!editingQuestion) return;
        setEditingQuestion({ ...editingQuestion, [field]: value } as Question);
    };

    const handleDelete = (id: number) => {
        setQuestions((prev: Question[]) => prev.filter((p) => p.id !== id));
        if (selectedQuestionId === id) setSelectedQuestionId(null);
        closeEditor();
    };

    const handleSave = () => {
        if (!editingQuestion) return;
        setQuestions((prev: Question[]) => prev.map((p) => (p.id === editingQuestion.id ? editingQuestion : p)));
        closeEditor();
    };
    
    return(
        <>
            <div className="w-8/12 flex justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-bold mb-4">QUẢN LÝ CÂU HỎI / TRẢ LỜI</h1>
                    <SearchBar />
                    {/* Bộ lọc câu hỏi: Tìm kiếm, Dropdown menu loại câu hỏi, Lọc theo lớp (Kết hợp giữa dropdown gợi ý và textarea input) */}
                    <div className="w-full max-w-3xl mt-6">
                        <h2 className="text-xl font-semibold mb-2">Danh sách câu hỏi</h2>
                        <ul>
                            {questions.map((q: Question) => {
                                const answersForQ = answerList.filter((a) => a.questionID === q.id);
                                const expanded = q.id === selectedQuestionId;
                                return (
                                    <li key={q.id} className="mb-2">
                                        <div
                                            className={`p-2 border rounded cursor-pointer flex justify-between items-center ${expanded ? 'bg-gray-100' : 'bg-white'}`}
                                            onClick={() => selectQuestion(q.id)}
                                        >
                                            <div>
                                                <div className="font-medium">{q.content}</div>
                                                <div className="text-sm text-gray-500">Status: {q.status}</div>
                                            </div>
                                            <div className="ml-4 flex items-center gap-2">
                                                <button
                                                    onClick={(e) => openEditor(e, q)}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <div className="text-sm text-gray-600">{expanded ? '▲' : '▼'}</div>
                                            </div>
                                        </div>

                                        {expanded && (
                                            <div className="mt-2 ml-4 p-3 border-l-2 border-gray-200 bg-gray-50 rounded-r">
                                                <h4 className="font-medium mb-2">Câu trả lời</h4>
                                                <ul>
                                                    {answersForQ.length ? answersForQ.map((a) => (
                                                        <li key={a.id} className="mb-2 p-2 border rounded bg-white">{a.content}</li>
                                                    )) : <li className="text-sm text-gray-500">Chưa có câu trả lời</li>}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {editingQuestion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-40" onClick={closeEditor}></div>
                    <div className="relative bg-white rounded p-6 w-full max-w-lg z-10">
                        <h3 className="text-lg font-semibold mb-4">Edit Question #{editingQuestion.id}</h3>

                        <label className="block mb-2">
                            <div className="text-sm font-medium">Content</div>
                            <textarea
                                className="w-full mt-1 p-2 border rounded"
                                rows={4}
                                value={editingQuestion.content}
                                onChange={(e) => handleEditChange('content', e.target.value)}
                            />
                        </label>

                        <label className="block mb-2">
                            <div className="text-sm font-medium">Status</div>
                            <select
                                className="w-full mt-1 p-2 border rounded"
                                value={editingQuestion.status}
                                onChange={(e) => handleEditChange('status', e.target.value)}
                            >
                                <option value="New">New</option>
                                <option value="Processing">Processing</option>
                                <option value="Answered">Answered</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </label>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() => handleDelete(editingQuestion.id)}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                onClick={handleSave}
                            >
                                Done
                            </button>
                            <button className="px-3 py-1 rounded border" onClick={closeEditor}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}