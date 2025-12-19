"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Question = {
    id: number;
    title?: string;
    content?: string;
    userID?: number;
    topicID?: number;
    createDate?: string;
    status?: string;
};

type Answer = {
    id: number;
    questionID?: number;
    content?: string;
    userID?: number;
    answerDate?: string;
};

const API_BASE = "http://localhost:8080";

export default function Question() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answersMap, setAnswersMap] = useState<Record<number, Answer[]>>({});
    const [loadingAnswers, setLoadingAnswers] = useState<Record<number, boolean>>(
        {}
    );
    
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
        null
    );

    const [editingQuestion, setEditingQuestion] = useState<Question | null>(
        null
    );

    const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);
    const [editingAnswerQuestionId, setEditingAnswerQuestionId] = useState<
        number | null
    >(null);
    const [pendingDelete, setPendingDelete] = useState<{
        kind: 'question' | 'answer';
        id: number;
        questionId?: number;
    } | null>(null);

    const statusLabel = (s?: string) => {
        if (!s) return 'TRẠNG THÁI';
        if (s === 'PROCESSING') return 'Đang xử lý';
        if (s === 'ANSWERED') return 'Đã trả lời';
        if (s === 'CLOSED') return 'Đã đóng';
        return s;
    };

    const fetchQuestions = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/questions`, {
                credentials: "include",
            });
            const data = await res.json();

            setQuestions(
                (data || []).map((d: any) => ({
                    id: d.questionId ?? d.id,
                    title: d.title,
                    content: d.content,
                    userID: d.studentId ?? d.userId,
                    topicID: d.topicId,
                    createDate: d.createdDate,
                    status: d.status,
                }))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (keyword: string) => {
        const q = (keyword || '').trim();
        if (!q) {
            await fetchQuestions();
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/questions/search?keyword=${encodeURIComponent(q)}`, { credentials: 'include' });
            if (!res.ok) {
                console.warn('search returned', res.status);
                setQuestions([]);
                return;
            }
            const data = await res.json();
            setQuestions(
                (data || []).map((d: any) => ({
                    id: d.questionId ?? d.id,
                    title: d.title,
                    content: d.content,
                    userID: d.studentId ?? d.userId,
                    topicID: d.topicId,
                    createDate: d.createdDate,
                    status: d.status,
                }))
            );
            setSelectedQuestionId(null);
            setAnswersMap({});
        } catch (err) {
            console.error('search error', err);
            setQuestions([]);
        }
    };

    const fetchAnswers = async (questionId: number) => {
        if (answersMap[questionId]) return;

        setLoadingAnswers((s) => ({ ...s, [questionId]: true }));
        try {
            const res = await fetch(
                `${API_BASE}/api/answers/question/${questionId}`,
                { credentials: "include" }
            );
            const data = await res.json();

            setAnswersMap((s) => ({
                ...s,
                [questionId]: (data || []).map((a: any) => ({
                    id: a.answerId ?? a.id,
                    questionID: a.questionId,
                    content: a.content,
                    userID: a.userId,
                    answerDate: a.createdDate,
                })),
            }));
        } catch (err) {
            console.error(err);
            setAnswersMap((s) => ({ ...s, [questionId]: [] }));
        } finally {
            setLoadingAnswers((s) => ({ ...s, [questionId]: false }));
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const selectQuestion = (id: number) => {
        setSelectedQuestionId((prev) => {
            if (prev === id) return null;
            fetchAnswers(id);
            return id;
        });
    };

    const updateStatus = async (questionId: number, status: string) => {
        try {
        await fetch(`http://localhost:8080/api/questions/${questionId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status }),
        });
        await fetchQuestions();
        } catch (err) {
        console.error("updateStatus", err);
        }
    };

    const handleDeleteQuestion = (id: number) => {
        // open confirmation modal
        setPendingDelete({ kind: 'question', id });
    };


    const openAnswerEditor = (
        e: React.MouseEvent,
        answer: Answer,
        questionId: number
    ) => {
        e.stopPropagation();
        setEditingAnswer({ ...answer });
        setEditingAnswerQuestionId(questionId);
    };

    const handleAnswerDelete = (
        e: React.MouseEvent,
        answerId: number,
        questionId: number
    ) => {
        e.stopPropagation();
        setPendingDelete({ kind: 'answer', id: answerId, questionId });
    };

    const performPendingDelete = async () => {
        if (!pendingDelete) return;
        const { kind, id, questionId } = pendingDelete;
        try {
            if (kind === 'question') {
                const res = await fetch(`${API_BASE}/api/questions/${id}`, { method: 'DELETE', credentials: 'include' });
                if (!res.ok) console.warn('DELETE question returned', res.status);
                setQuestions((prev) => prev.filter((q) => q.id !== id));
                setSelectedQuestionId(null);
                setEditingQuestion(null);
            } else {
                const res = await fetch(`${API_BASE}/api/answers/${id}`, { method: 'DELETE', credentials: 'include' });
                if (!res.ok) console.warn('DELETE answer returned', res.status);
                if (questionId !== undefined) {
                    setAnswersMap((prev) => ({ ...prev, [questionId]: prev[questionId]?.filter((a) => a.id !== id) }));
                }
            }
        } catch (err) {
            console.error('performPendingDelete', err);
        } finally {
            setPendingDelete(null);
        }
    };

    const handleAnswerSave = async () => {
        if (!editingAnswer || !editingAnswerQuestionId) return;

        try {
            await fetch(`${API_BASE}/api/answers/${editingAnswer.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content: editingAnswer.content }),
            });

            setAnswersMap((prev) => ({
                ...prev,
                [editingAnswerQuestionId]: prev[
                    editingAnswerQuestionId
                ]?.map((a) =>
                    a.id === editingAnswer.id ? editingAnswer : a
                ),
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setEditingAnswer(null);
            setEditingAnswerQuestionId(null);
        }
    };


    return (
        <>
            <div className="w-8/12">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    QUẢN LÝ CÂU HỎI / TRẢ LỜI
                </h1>

                <SearchBar placeholder="Tìm câu hỏi..." onSearch={handleSearch} />

                <div className="space-y-3 mt-6">
                    {questions.map((q) => {
                        const expanded = q.id === selectedQuestionId;
                        const answers = answersMap[q.id] ?? [];

                        return (
                            <Card
                                key={q.id}
                                className="p-4 cursor-pointer"
                                onClick={() => selectQuestion(q.id)}
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <div className="font-medium">
                                            {q.content}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Status: {q.status}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <select
                                            value={""}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                const s = e.target.value;
                                                if (s) updateStatus(q.id, s);
                                            }}
                                            className="cursor-pointer"
                                        > 
                                            <option value="" disabled>{statusLabel(q.status)}</option>
                                            {['PROCESSING', 'ANSWERED', 'CLOSED']
                                                .filter((s) => s !== (q.status ?? ''))
                                                .map((s) => (
                                                <option key={s} value={s}>{statusLabel(s)}</option>
                                                ))}
                                        </select>
                                        <Button
                                            variant="destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteQuestion(q.id);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                {expanded && (
                                    <div className="mt-4 border-t pt-3">
                                        {loadingAnswers[q.id] ? (
                                            <div>Đang tải...</div>
                                        ) : answers.length ? (
                                            answers.map((a) => (
                                                <div
                                                    key={a.id}
                                                    className="border rounded p-3 mb-2"
                                                >
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-500">
                                                            {a.userID} ·{" "}
                                                            {a.answerDate}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={(e) =>
                                                                    openAnswerEditor(
                                                                        e,
                                                                        a,
                                                                        q.id
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={(e) =>
                                                                    handleAnswerDelete(
                                                                        e,
                                                                        a.id,
                                                                        q.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        {a.content}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500">
                                                Chưa có câu trả lời
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>

            {editingAnswer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setEditingAnswer(null)}
                    />
                    <div className="bg-white p-6 rounded z-10 w-full max-w-lg">
                        <h3 className="font-semibold mb-4">
                            Edit Answer #{editingAnswer.id}
                        </h3>

                        <textarea
                            className="w-full border p-2 rounded"
                            rows={5}
                            value={editingAnswer.content ?? ""}
                            onChange={(e) =>
                                setEditingAnswer({
                                    ...editingAnswer,
                                    content: e.target.value,
                                })
                            }
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setEditingAnswer(null)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleAnswerSave}>Save</Button>
                        </div>
                    </div>
                </div>
            )}

                {pendingDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setPendingDelete(null)} />
                        <div className="bg-white p-6 rounded z-10 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Xác nhận</h3>
                            <p className="mb-4">{pendingDelete.kind === 'question' ? 'Bạn có chắc muốn xoá câu hỏi này?' : 'Bạn có chắc muốn xoá câu trả lời này?'}</p>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setPendingDelete(null)}>Hủy</Button>
                                <Button variant="destructive" onClick={performPendingDelete}>Xoá</Button>
                            </div>
                        </div>
                    </div>
                )}

        </>
    );
}
