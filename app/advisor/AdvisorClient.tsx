"use client"

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Question = {
  questionId: number;
  title: string;
  content?: string;
  studentId?: string;
  classId?: string;
  topicId?: number;
  status?: string;
  createdDate?: string;
};

type TopicItem = { topicId: number; topicName: string };

export default function AdvisorClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filtered, setFiltered] = useState<Question[]>([]);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [answersMap, setAnswersMap] = useState<Record<number, Answer[] | undefined>>({});
  const [loadingAnswers, setLoadingAnswers] = useState<Record<number, boolean>>({});

  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterTopic, setFilterTopic] = useState<number | "all">("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [replyFor, setReplyFor] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  type Answer = { answerId: number; content: string; userId?: string; answerDate?: string; fileUrl?: string };

  const statusLabel = (s?: string) => {
    if (!s) return 'TRẠNG THÁI';
    if (s === 'PROCESSING') return 'Đang xử lý';
    if (s === 'ANSWERED') return 'Đã trả lời';
    if (s === 'CLOSED') return 'Đã đóng';
    return s;
  };

  const fetchAnswers = async (questionId: number, force = false) => {
    if (!force && answersMap[questionId] !== undefined) return; // already fetched (could be empty array)
    setLoadingAnswers((s) => ({ ...s, [questionId]: true }));
    try {
      const res = await fetch(`http://localhost:8080/api/answers/question/${questionId}`, { credentials: 'include' });
      if (!res.ok) {
        setAnswersMap((s) => ({ ...s, [questionId]: [] }));
        return;
      }
      const data = await res.json();
      setAnswersMap((s) => ({ ...s, [questionId]: data || [] }));
    } catch (err) {
      console.error('fetchAnswers', err);
      setAnswersMap((s) => ({ ...s, [questionId]: [] }));
    } finally {
      setLoadingAnswers((s) => ({ ...s, [questionId]: false }));
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/questions/advisor/my", { credentials: "include" });
      if (!res.ok) throw new Error(String(res.status));
      console.log(res);
      const data = await res.json();
      setQuestions(data || []);
    } catch (err) {
      console.error("fetchQuestions", err);
      setQuestions([]);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/topics", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setTopics(data || []);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchTopics();
  }, []);

  useEffect(() => {
    let out = [...questions];
    if (filterClass !== "all") out = out.filter((q) => q.classId === filterClass);
    if (filterTopic !== "all") out = out.filter((q) => (q.topicId ?? -1) === filterTopic);
    if (filterStatus !== "all") out = out.filter((q) => q.status === filterStatus);
    setFiltered(out);
  }, [questions, filterClass, filterTopic, filterStatus]);

  const handleReply = async (questionId: number) => {
    if (!replyContent.trim()) return;
    try {
      await fetch("http://localhost:8080/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ questionId, content: replyContent }),
      });

      setReplyContent("");
      setReplyFor(null);
      // force re-fetch answers for this question (bypass cache)
      await fetchAnswers(questionId, true);
      // refresh question list counts/statuses
      await fetchQuestions();
    } catch (err) {
      console.error("handleReply", err);
    }
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Trang quản lý CVHT</h1>
      <p className="mt-2 text-muted-foreground">Xem và xử lý câu hỏi của sinh viên lớp bạn phụ trách.</p>

      <Card className="mt-4 p-4">
        <div className="flex flex-wrap gap-3 items-center">

          <label className="text-sm">Chủ đề:</label>
          <select value={filterTopic as any} onChange={(e) => setFilterTopic(e.target.value === "all" ? "all" : Number(e.target.value))} className="px-2 py-1 border rounded cursor-pointer">
            <option value="all">Tất cả</option>
            {topics.map((t) => (
              <option key={t.topicId} value={t.topicId}>{t.topicName}</option>
            ))}
          </select>

          <label className="text-sm">Trạng thái:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-2 py-1 border rounded cursor-pointer">
            <option value="all">Tất cả</option>
            <option value="PROCESSING">Đang xử lý</option>
            <option value="ANSWERED">Đã trả lời</option>
            <option value="CLOSED">Đóng</option>
          </select>

          <div className="ml-auto">
            <Button className="cursor-pointer" onClick={() => { setFilterClass("all"); setFilterTopic("all"); setFilterStatus("all"); }}>Reset</Button>
          </div>
        </div>
      </Card>

      <div className="mt-4 space-y-3">
        {filtered.map((q) => (
          <Card
            key={q.questionId}
            className="p-4 cursor-pointer hover:opacity-95 transition-opacity"
            onClick={async () => {
              if (expanded === q.questionId) {
                setExpanded(null);
              } else {
                setExpanded(q.questionId);
                await fetchAnswers(q.questionId);
              }
            }}
          >
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <div className="font-bold text-lg text-left w-full">{q.title}</div>
                <div className="text-sm text-muted-foreground">Lớp: {q.classId} · Sinh viên: {q.studentId} </div>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{q.content}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <Button className="cursor-pointer w-full" onClick={(e) => { e.stopPropagation(); setReplyFor(q.questionId); }}>Trả lời</Button>
                <select
                  value={""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    const s = e.target.value;
                    if (s) updateStatus(q.questionId, s);
                  }}
                  className="px-2 py-1 border rounded cursor-pointer w-full"
                > 
                  <option value="" disabled>{statusLabel(q.status)}</option>
                  {['PROCESSING', 'ANSWERED', 'CLOSED']
                    .filter((s) => s !== (q.status ?? ''))
                    .map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                </select>
              </div>
            </div>

            {expanded === q.questionId && (
              <div className="mt-3 border-t pt-3" onClick={(e) => e.stopPropagation()}>
                {loadingAnswers[q.questionId] ? (
                  <div className="text-sm text-muted-foreground">Đang tải câu trả lời...</div>
                ) : (
                  <div className="space-y-3">
                    {(answersMap[q.questionId] && answersMap[q.questionId]!.length > 0) ? (
                      (answersMap[q.questionId] || []).map((a) => (
                        <div key={a.answerId} className="p-3 bg-gray-50 rounded">
                          <div className="text-sm text-muted-foreground">{a.userId} · {a.answerDate}</div>
                          <div className="mt-1 text-gray-800 whitespace-pre-line">{a.content}</div>
                          {a.fileUrl && (
                            <div className="mt-2"><a className="text-sm text-blue-600" href={a.fileUrl}>Tệp đính kèm</a></div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">Chưa có câu trả lời.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {replyFor === q.questionId && (
              <div className="mt-3 border-t pt-3" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <textarea onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} value={replyContent} onChange={(e) => setReplyContent(e.target.value)} className="w-full p-2 border rounded" rows={4} placeholder="Soạn câu trả lời..."></textarea>
                <div className="mt-2 flex items-center gap-2">
                  <Button onClick={(e) => { e.stopPropagation(); handleReply(q.questionId); }}>Gửi trả lời</Button>
                  <Button variant="ghost" onClick={(e) => { e.stopPropagation(); setReplyFor(null); setReplyContent(""); }}>Hủy</Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-gray-600 italic">Không có câu hỏi khớp bộ lọc.</div>
        )}
      </div>
    </div>
  );
}
