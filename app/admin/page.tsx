'use client'
import { Card } from "@/components/ui/card"
import React, { useState, useEffect } from "react";

export default function Admin() {
    const [func, setFunc] = useState(0)

    const funcs = [
        { label: "Quản lý câu hỏi / trả lời", funcID: 0},
        { label: "Quản lý người dùng", funcID: 1},
        { label: "Học tập - Môn học", funcID: 2},
        { label: "CĐTN / KLTN", funcID: 3},
        { label: "Học phí", funcID: 4},
        { label: "Hoạt động - CLB", funcID: 5},
        { label: "Khác", funcID: 6},
    ]

    useEffect(() => {
        // ensure default selection is applied on mount
        setFunc(0);
    }, []);

    return ( 
        <>
            <div className="w-full h-[100vh] flex align-center justify-center">
                <div className="divide-y divide-border">
                    <Card>
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
                    </Card>
                </div>
            </div>
        </>
     );
};