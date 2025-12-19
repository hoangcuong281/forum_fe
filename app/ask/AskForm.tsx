"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AskForm() {
  const router = useRouter();

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    topicId: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSelectChange = (value: string) => {
    setNewQuestion((prev) => ({
      ...prev,
      topicId: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newQuestion.topicId ||
      !newQuestion.title.trim() ||
      !newQuestion.content.trim()
    ) {
      setError("Vui lòng nhập đầy đủ nội dung câu hỏi");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/questions", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newQuestion.title.trim(),
          content: newQuestion.content.trim(),
          topicId: Number(newQuestion.topicId),
        }),
      });

      if (!res.ok) {
        setError("Gửi câu hỏi thất bại, vui lòng thử lại");
        return;
      }

      router.push("/");
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      console.error(err);
    }
  };

  return (
    <div className="py-15 w-full flex justify-center items-center bg-[#ededed]">
      <div className="w-4/5 lg:w-1/3 py-10 rounded-lg flex justify-center items-center m-10 flex-col bg-white">
        <span className="font-bold text-lg mb-4">ĐẶT CÂU HỎI</span>

        <div className="w-full max-w-md p-5">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="topicId">Chủ đề</FieldLabel>
                    <Select onValueChange={handleSelectChange}>
                      <SelectTrigger id="topicId">
                        <SelectValue placeholder="Chủ đề câu hỏi của bạn?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Học vụ - Thủ tục</SelectItem>
                        <SelectItem value="2">Học tập - Môn học</SelectItem>
                        <SelectItem value="3">CĐTN / KLTN</SelectItem>
                        <SelectItem value="4">Học phí</SelectItem>
                        <SelectItem value="5">Hoạt động - CLB</SelectItem>
                        <SelectItem value="6">Hướng nghiệp - Định hướng</SelectItem>
                        <SelectItem value="7">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="title">Tiêu đề câu hỏi</FieldLabel>
                    <Textarea
                      name="title"
                      id="title"
                      placeholder="Tiêu đề câu hỏi của bạn?"
                      className="resize-none"
                      onChange={handleInputChange}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="content">Câu hỏi</FieldLabel>
                    <Textarea
                      name="content"
                      id="content"
                      placeholder="Câu hỏi của bạn?"
                      className="resize-none"
                      onChange={handleInputChange}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              {error && (
                <p className="text-red-600 text-sm mt-2 font-medium">
                  {error}
                </p>
              )}

              <Field orientation="horizontal">
                <Button
                  type="submit"
                  className="cursor-pointer text-white bg-(--main-lightRed)
                  border-1 border-transparent hover:bg-white hover:text-black
                  hover:border-black"
                >
                  Gửi
                </Button>

                <Link href="/">
                  <Button variant="outline" type="button">
                    Hủy
                  </Button>
                </Link>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
