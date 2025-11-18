"use client";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookText } from "lucide-react"

import React, { useState, useEffect } from "react";

const categories = [
  { label: "Tất cả các câu hỏi", categoryID: 0, href: "#" },
  { label: "Học vụ - Thủ tục", categoryID: 1, href: "#" },
  { label: "Học tập - Môn học", categoryID: 2, href: "#" },
  { label: "CĐTN / KLTN", categoryID: 3, href: "#" },
  { label: "Học phí", categoryID: 4, href: "#" },
  { label: "Hoạt động - CLB", categoryID: 5, href: "#" },
  { label: "Khác", categoryID: 6, href: "#" },
]

const questions = [
  {title: "Học vụ - Thủ tục | A46369 | Lớp TE35CL02 | 29/10/2025", topicID: 1, Status: false, href:'#'},
  {title: "CĐTN / KLTN | A45333 | Lớp TT34CL01 | 27/10/2025", topicID: 2, Status: false, href:'#'},
  {title: "Học phí | A43779 | Lớp TI34CL03 | 25/10/2025", topicID: 3, Status: false, href:'#'},
  {title: "Học phí | A43779 | Lớp TI34CL04 | 25/10/2025", topicID: 4, Status: false, href:'#'},
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(0);

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
                  <BookText className="hidden sm:flex"/>
                  <span className="text-sm font-medium">{category.label}</span>
                </a>
              )
            })}
          </div>
        </Card>
        <div className="w-auto lg:w-[50%] flex justify-center items-center flex-col gap-2">
          <div className="w-full flex justify-start gap-2">
              <Button variant="outline" className="bg-(--main-lightRed) text-white hover:bg-(--main-lightRed) hover:text-white">Chọn lớp</Button>
              <Button variant="outline">Trạng thái câu hỏi</Button>
          </div>
          {questions
            .filter((q) => selectedCategory === 0 || q.topicID === selectedCategory)
            .map((question) => {
              return (
                <Card className="p-2 w-full hover:bg-muted gap-3" key={question.title}>
                  <a href={question.href}>{question.title}</a>
                  <div className="flex justify-end">
                    <Button
                      variant="secondary"
                      className="w-[20%] bg-(--main-lightRed) text-white border-[1px] border-transparent box-border hover:bg-white hover:text-black hover:border-black cursor-pointer"
                    >
                      Trả lời
                    </Button>
                  </div>
                </Card>
              )
            })}
        </div>
        <div className="hidden lg:flex justify-center items-center flex-col gap-2">
          <Card className="p-2 gap-3 w-full">
            <div className="flex flex-row gap-2 border-b pt-2 pb-2">
              <BookText/>
              <span className="text-sm font-medium text-foreground">Danh sách cố vấn học tập</span>
            </div>
            {advisors.map((advisor)=>{
              return(
                <span key={advisor.name}>{advisor.name}</span>
              );
              
            })}
          </Card>
          <Card className="p-2 gap-3 w-full">
            <div className="flex flex-row gap-2 border-b pt-2 pb-2">
              <BookText/>
              <span className="text-sm font-medium text-foreground">Bảng tin khoa CNTT</span>
            </div>
            {news.map((newItem)=>{
              return(
                <span key={newItem.title}>{newItem.title}</span>
              );
              
            })}
          </Card>
          <Card className="p-2 gap-3 w-full">
            <div className="flex flex-row gap-2 border-b pt-2 pb-2">
              <BookText/>
              <span className="text-sm font-medium text-foreground">Sinh viên tích cực</span>
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
