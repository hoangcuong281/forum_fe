"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import React, { useState }  from "react"

export default function FieldDemo() {
  const [newQuestion, setNewQuestion] = useState({
    topic: '',
    title: '',
    question: ''
  });
  const handleInputChange= (e: React.ChangeEvent<HTMLTextAreaElement>) =>{
    const {name, value} = e.target;
    setNewQuestion(prevData => ({
      ...prevData,
      [name]:value
    }));
  }
  const handleSelectChange = (value: string) => {
    setNewQuestion((prevData) => ({
      ...prevData,
      topic: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", newQuestion);
  };
  return (
    <div className="py-15 w-full flex justify-center items-center bg-[#ededed]">
      <div className="w-4/5 lg:w-1/3 py-10 rounded-lg flex justify-center items-center m-10 flex-col bg-white">
        <span className="font-bold text-lg">ĐẶT CÂU HỎI</span>
        <div className="w-full max-w-md p-5">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="topic">
                      Chủ đề
                    </FieldLabel>
                    <Select defaultValue="" onValueChange={handleSelectChange}>
                        <SelectTrigger id="topic">
                          <SelectValue placeholder="Chủ đề câu hỏi của bạn?" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="01">Học vụ - Thủ tục</SelectItem>
                            <SelectItem value="02">Học tập - Môn học</SelectItem>
                            <SelectItem value="03">CĐTN / KLTN</SelectItem>
                            <SelectItem value="04">Học phí</SelectItem>
                            <SelectItem value="05">Hoạt động - CLB</SelectItem>
                            <SelectItem value="06">Hướng nghiệp - Định hướng</SelectItem>
                            <SelectItem value="07">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="title">
                      Tiêu đề câu hỏi
                    </FieldLabel>
                    <Textarea
                      name="title"
                      id="title"
                      placeholder="Tiêu đề câu hỏi của bạn?"
                      className="resize-none"
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="question">
                      Câu hỏi
                    </FieldLabel>
                    <Textarea
                      name="question"
                      id="question"
                      placeholder="Câu hỏi của bạn?"
                      className="resize-none"
                      onChange={handleInputChange}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Field orientation="horizontal">
                <Button type="submit" className="cursor-pointer text-white bg-(--main-lightRed) border-1 border-transparent hover:bg-white hover:text-black hover:border-1 hover:border-black">Gửi</Button>
                <Link href="/">
                  <Button variant="outline" type="button" className="cursor-pointer">
                    Hủy
                  </Button>
                </Link>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  )
}
