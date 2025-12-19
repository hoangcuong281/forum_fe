'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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
  content: string;
  status: string;
};

type Answer = {
    answerId: number;
    questionId: number;
    content: string;
    userId: number;
    answerDate: string;
}

type Comment = {
  questionId: number;
  content: string;
}

export default function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [commentInput, setCommentInput] = useState('');

  const fetchQuestion = async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/questions/${id}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setQuestion(data);
      } else {
        console.error('Failed to fetch question', res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnswers = async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/answers/question/${id}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAnswers(data);
      } else {
        console.error('Failed to fetch answers', res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  useEffect(() => {
    fetchAnswers();
  }, [id]);


  if (!question) return (
    <div className="w-full flex justify-center mt-20">
      <div className="text-gray-600 italic">Loading...</div>
    </div>
  );

  const handleSend = async () => {
    if (!commentInput.trim() || !question) return;
    try {
      const res = await fetch(`http://localhost:8080/api/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          questionId: question.questionId,
          content: commentInput,
        }),
      });

      if (res.ok) {
        setCommentInput('');
        await Promise.all([fetchQuestion(), fetchAnswers()]);
      } else {
        console.error("Failed to send comment:", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex justify-center my-10 px-4">
      <div className="max-w-3xl w-full">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{question.title}</h1>
              <p className="mt-4 text-gray-700 whitespace-pre-line">{question.content}</p>
            </div>
            <div className="flex-shrink-0 ml-4 self-start">
              <div className="text-gray-500">
                {question.status === "NEW" ? (
                  <span className="px-2 py-1 text-x bg-blue-100 text-blue-800 rounded-full">Mới</span>
                ) : question.status === "ANSWERED" ? (
                  <span className="px-2 py-1 text-x bg-green-100 text-green-800 rounded-full">Đã trả lời</span>
                ) : question.status === "CLOSED" ? (
                  <span className="px-2 py-1 text-x bg-gray-100 text-gray-800 rounded-full">Đóng</span>
                ) : (
                  <span className="px-2 py-1 text-x bg-yellow-100 text-yellow-800 rounded-full">Đang chờ</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">CÁC CÂU TRẢ LỜI ({answers.length})</h2>

            {answers.length === 0 && (
              <div className="py-6 px-4 rounded-md bg-gray-50 text-gray-600">Chưa có câu trả lời nào.</div>
            )}

            <div className="space-y-4">
              {answers.map((answer) => (
                <div key={answer.answerId} className="flex gap-4 p-4 rounded-lg bg-gray-50 border">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">U</div>
                  <div className="flex-1">
                    <p className="text-gray-800">{answer.content}</p>
                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                      <span>{timeAgo(answer.answerDate)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>User #{answer.userId}</span>
                    </div>

                  </div>
                </div>
              ))}

              <div className="mt-2 p-4 rounded-lg bg-white border">
                <h3 className="text-sm font-medium text-gray-500 italic">Nếu bạn còn thắc mắc, hãy hỏi thêm ở bên dưới</h3>

                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  rows={4}
                  className="w-full mt-3 p-2 border rounded-md text-gray-800"
                  placeholder="Câu hỏi thêm..."
                />
                <div className="mt-3 flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm cursor-pointer"
                    onClick={handleSend}
                    >
                    Gửi
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm cursor-pointer">Hủy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
