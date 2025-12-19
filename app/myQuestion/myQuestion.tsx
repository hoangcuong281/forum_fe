'use client';

import {Card} from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";

function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // giây

  if (diff < 60) return `${diff} giây trước`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(diff / 3600);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days} ngày trước`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;

  const years = Math.floor(months / 12);
  return `${years} năm trước`;
}

type Question = {
  questionId: number;
  title: string;
  topicID: number;
  content: string;
  status: string;
  createdDate: string;
};

export default function MyQuestion() {

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/questions/my", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        } else {
          console.error("Fetch failed:", res.status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const Spinner = () => (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (loading) return <Spinner />;

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center bg-gray-50 py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-[Arial]">CÂU HỎI CỦA TÔI</h1>
          <p className="mt-2 text-sm text-gray-500">{questions.length} câu hỏi</p>
        </div>

        {questions.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-lg">Không có câu hỏi nào.</p>
            <p className="mt-2 text-sm text-gray-400">Khi bạn tạo câu hỏi, nó sẽ hiện ở đây.</p>
          </Card>
        )}

        <div className="space-y-4">
          {questions.map((question) => (
            <Card
              key={question.questionId}
              className="w-full p-4 cursor-pointer hover:shadow-lg transition-transform duration-150 ease-in-out"
              onClick={() => (window.location.href = `/question/${question.questionId}`)}
            >
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold leading-tight text-gray-900">{question.title}</h2>
                  <p className="mt-2 text-sm text-gray-600 overflow-hidden text-ellipsis max-h-20">{question.content}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-500">
                      <span>{timeAgo(question.createdDate)}</span>
                  </div>
                  <div className="text-gray-500">
                    {question.status === "NEW" ? (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Mới</span>
                    ) : question.status === "ANSWERED" ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Đã trả lời</span>
                    ) : question.status === "CLOSED" ? (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Đóng</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Đang chờ</span>
                    )}
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
