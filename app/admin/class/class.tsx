'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react";

type Student = {
    id: number;
    name: string;
    email: string;
    classID: number;
}

type ClassType = {
    id: number;
    name: string;
    advisorID: number;
    academicYear: string;
}

export default function Class(){
    const [classes, setClasses] = useState<ClassType[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);

    useEffect(() => {
        // Fetch or initialize class data here
        // For demonstration, we use static data
        const classList: ClassType[] = [
            { id: 1, name: "TI35h1", advisorID: 501, academicYear: "2023-2024" },
            { id: 2, name: "TI35h2", advisorID: 502, academicYear: "2023-2024" },
            { id: 3, name: "TI35h3", advisorID: 503, academicYear: "2023-2024" },
        ];
        setClasses(classList);
    }, []);

    useEffect(() => {
        // Fetch or initialize class data here
        // For demonstration, we use static data
        const studentList: Student[] = [
            { id: 1, name: "Nguyen Van A", email: "a@example.com", classID: 1 },
            { id: 2, name: "Tran Thi B", email: "b@example.com", classID: 2 },
            { id: 3, name: "Le Van C", email: "c@example.com", classID: 3 },
        ];
        setStudents(studentList);
    }, []);

    const handleClassClick = (cls: ClassType) => {
        setSelectedClass(cls);
    };

    return(
        <div className="w-8/12 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">QUẢN LÝ LỚP HỌC - CVHT PHỤ TRÁCH</h1>
            <div className="w-full flex justify-center items-center">
                <div className="w-2/10 flex flex-col justify-center items-center ">
                    <div className="flex justify-center items-center">Danh sách lớp</div>
                    {classes.map((cls) => (
                        <Card key={cls.id} className="w-full mb-4 p-4 flex-row justify-between items-center" onClick={() => handleClassClick(cls)}>
                            <div className="flex flex-col items-start">
                                <div>{cls.name}</div>
                                <div>CVHT: {cls.advisorID}</div>
                            </div>
                            <Button variant='outline' className="cursor-pointer">Chi tiết</Button>
                        </Card>
                    ))}
                </div>
                <div className="w-2/10 flex flex-col justify-center items-center ">
                    <div className="flex justify-center items-center">Danh sách sinh viên</div>
                    {selectedClass ? (
                        students.filter(student => student.classID === selectedClass.id).map(student => (
                            <Card key={student.id} className="w-full mb-4 p-4 flex-row justify-between items-center">
                                <div className="flex flex-col items-start">
                                    <div>{student.name}</div>
                                    <div>{student.email}</div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div>Vui lòng chọn một lớp để xem danh sách sinh viên.</div>
                    )}
                </div>
            </div>

        </div>
    )
}