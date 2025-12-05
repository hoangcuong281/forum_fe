'use client'
import { Card } from "@/components/ui/card"
import React, { useState, useEffect } from "react";

import Question from "./question/question";
import User from "./user/user";
import Register from "./register/register";
import Topic from "./topic/topic";
import Class from "./class/class";
import Censor from "./censor/censor";
import Statistical from "./statistical/statistical";

export default function Admin() {
    const [func, setFunc] = useState(0)

    const funcs = [
        { label: "Quản lý câu hỏi / trả lời", funcID: 0},
        { label: "Quản lý người dùng", funcID: 1},
        { label: "Đăng ký / tạo tài khoản mới", funcID: 2},
        { label: "Quản lý danh mục chủ đề", funcID: 3},
        { label: "Quản lý lớp - CVHT phụ trách", funcID: 4},
        { label: "Kiểm duyệt nội dung", funcID: 5},
        { label: "Báo cáo & thống kê", funcID: 6},
    ]

    useEffect(() => {
        // ensure default selection is applied on mount
        setFunc(0);
    }, []);

    return ( 
        <>
            <div className="w-full flex justify-evenly items-start my-10">
                <div className="divide-y divide-border">
                    <Card className="p-0 overflow-hidden gap-0 cursor-pointer">
                        {funcs.map((f) => {
                            return (
                                <a
                                key={f.label}
                                onClick={(e) => { e.preventDefault(); setFunc(f.funcID); }}
                                aria-current={func === f.funcID ? 'page' : undefined}
                                className={`flex p-3 gap-2 ${func === f.funcID ? 'bg-(--main-blueHover) text-white': 'hover:bg-muted transition-colors'}`}
                                >
                                <span className="text-sm font-medium">{f.label}</span>
                                </a>
                            )
                        })}
                    </Card>
                </div>
                {func === 0 && <Question/>}
                {func === 1 && <User/>}
                {func === 2 && <Register/>}
                {func === 3 && <Topic/>}
                {func === 4 && <Class/>}
                {func === 5 && <Censor/>}
                {func === 6 && <Statistical/>}
            </div>
        </>
     );
};