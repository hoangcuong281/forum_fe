"use client";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";

const categories = [
  { label: "Tất cả các câu hỏi", categoryID: 0, href: "#" },
  { label: "Học vụ - Thủ tục", categoryID: 1, href: "#" },
  { label: "Học tập - Môn học", categoryID: 2, href: "#" },
  { label: "CĐTN / KLTN", categoryID: 3, href: "#" },
  { label: "Học phí", categoryID: 4, href: "#" },
  { label: "Hoạt động - CLB", categoryID: 5, href: "#" },
  { label: "Hướng nghiệp - Định hướng", categoryID: 6, href: "#" },
  { label: "Khác", categoryID: 7, href: "#" },
]

const advisors = [
  {name: "Nguyễn Văn A", gender: "Female"},
  {name: "Nguyễn Văn B", gender: "Male"},
  {name: "Nguyễn Văn C", gender: "Female"},
]

const news = [
  {title: "Thông báo đóng học kì 1 Nhóm 1"},
  {title: "Thông báo khám sức khoẻ định kỳ toàn trường"},
  {title: "Thông báo thi TOEIC nội bộ"},
]

const students = [
  {name: 'Jake'},
  {name: 'Paul'},
  {name: 'Walker'},
  {name: 'Daryl'},
]

const questionHref = 'http://localhost:3000/question/'

interface Question {
  questionId?: number;
  title: string;
  content?: string;
  studentId?: string;
  classId?: string;
  topicId?: number; // backend may use `topicId` or `topicID`
  topicID?: number;
  createdDate?: string;
  status?: string;
  href?: string;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const filteredQuestions = questions.filter(
    (q) =>
      selectedCategory === 0 ||
      (q.topicId ?? q.topicID) === selectedCategory
  );

  const checkLog = async () => {
    try {
      const checkRole = await fetch('http://localhost:8080/api/auth/me', { method: "GET", credentials: 'include' })
      if (!checkRole.ok) {
        return false;
      }
      return true;
    }catch (e) {
      console.error('Failed to fetch current user after login', e)
    }
  }

  useEffect(() => {
  const init = async () => {
    const logged = await checkLog();
    setIsLoggedIn(logged);
  };
  init();
}, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/questions", {
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
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // ensure default selection is applied on mount
    setSelectedCategory(0);
  }, []);

  
  
  return (
    <div className="h-[100vh] w-full flex justify-start items-center flex-col bg-[#ededed]">
      <div className="w-full flex justify-center items-center gap-2 flex-col p-5 bg-(--main-blue) text-white text-center">
        <span>Diễn đàn hỏi - Đáp sinh viên & Cố vấn học tập - Khoa toán tin</span>
        <span>Student - Academic Advisor Q & A Forum | Faculty of Mathematics & Informatics</span>
        <a href="/ask">
          <Button variant="secondary" className="bg-(--main-lightRed) text-white hover:bg-white hover:text-black cursor-pointer">
            Đặt câu hỏi
          </Button>
        </a>
      </div>
      <div className="w-full flex justify-evenly items-start my-2">
        
        <Card className="p-0 overflow-hidden">
        
          <div className="divide-y divide-border">
            {categories.map((category) => {
              return (
                <a
                  key={category.label}
                  href={category.href}
                  onClick={(e) => { e.preventDefault(); setSelectedCategory(category.categoryID); }}
                  aria-current={selectedCategory === category.categoryID ? 'page' : undefined}
                  className={`flex p-3 gap-2 ${selectedCategory === category.categoryID ? 'bg-(--main-blueHover) text-white': 'hover:bg-muted transition-colors'}`}
                >
                  <span className="text-sm font-medium">{category.label}</span>
                </a>
              )
            })}
          </div>
        </Card>
        <div className="w-auto lg:w-[50%] flex justify-center items-center flex-col gap-2">
          <div className="w-full md:w-[300px] lg:w-[500px] flex self-start gap-2">
            <InputGroup className="bg-white">
              <InputGroupInput placeholder="Câu hỏi của bạn là gì?" />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <Button 
              variant="outline" 
              className="cursor-pointer bg-(--main-blueHover) text-white hover:bg-(--main-blueHover)/80 hover:text-white"
            >Tìm kiếm
            </Button>
          </div>
          {!isLoggedIn ? (
            <p className="text-center text-muted-foreground py-6">
              Bạn cần phải đăng nhập để xem câu hỏi
            </p>
          ) : filteredQuestions.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              Chưa có câu hỏi nào
            </p>
          ) : (
            filteredQuestions.map((question) => {
                return (
                  <Card className="px-4 py-2 w-full hover:bg-muted gap-3" key={question.questionId}>
                    <a className="font-bold" href={question.questionId ? `${questionHref}${question.questionId}` : '#'}>
                      {question.title}
                    </a>
                    <span>{question.studentId}</span>
                  </Card>
                )
              })
          )}
        </div>
        <div className="hidden lg:flex justify-center items-center flex-col gap-2">
          <Card className="p-2 gap-3 w-full">
            <div className="flex flex-row gap-2 border-b pt-2 pb-2">
              <span className="text-lg text-foreground font-bold">Danh sách cố vấn học tập</span>
            </div>
            {advisors.map((advisor)=>{
              return(
                <span key={advisor.name}>{advisor.name}</span>
              );
              
            })}
          </Card>
          <Card className="p-2 gap-3 w-full">
            <div className="flex flex-row gap-2 border-b pt-2 pb-2">
              <span className="text-lg text-foreground font-bold">Bảng tin khoa CNTT</span>
            </div>
            {news.map((newItem)=>{
              return(
                <span key={newItem.title}>{newItem.title}</span>
              );
              
            })}
          </Card>
          <Card className="p-2 gap-3 w-full">
            <div className="flex flex-row gap-2 border-b pt-2 pb-2">
              <span className="text-lg text-foreground font-bold">Sinh viên tích cực</span>
            </div>
            {students.map((student)=>{
              return(
                <span key={student.name}>{student.name}</span>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
