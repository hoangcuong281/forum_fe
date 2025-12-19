"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { TrendingUp, BookOpen, Users, HelpCircle } from "lucide-react"

interface Question {
  questionId: number
  title: string
  content: string
  studentId: string
  classId: number
  topicId: number
  createdDate: string
  status: string
}

interface ClassItem {
  classId: number
  className: string
}

interface Topic {
  topicId: number
  topicName: string
}
const COLORS = [
  "hsl(210, 100%, 50%)", // Blue
  "hsl(150, 80%, 40%)", // Green
  "hsl(35, 100%, 50%)", // Orange
  "hsl(340, 80%, 55%)", // Pink
  "hsl(270, 70%, 55%)", // Purple
  "hsl(180, 70%, 45%)", // Cyan
  "hsl(60, 70%, 45%)", // Yellow
]

const getShortTopicName = (name: string) => {
  const shortNames: Record<string, string> = {
    "Hỏi đáp Học vụ - Thủ tục": "Học vụ",
    "Hỏi đáp Học tập - Môn học": "Học tập",
    "Hỏi đáp CĐTN / KLTN": "CĐTN/KLTN",
    "Hỏi đáp Học phí": "Học phí",
    "Hoạt động - CLB": "CLB",
    "Hướng nghiệp - Định hướng": "Hướng nghiệp",
    Khác: "Khác",
  }
  return shortNames[name] || name
}

export default function Statistical() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [classesRes, topicsRes, questionsRes] = await Promise.all([
          fetch('http://localhost:8080/api/classes',{
            credentials: 'include'
          }),
          fetch('http://localhost:8080/api/topics',{
            credentials: 'include'
          }),
          fetch('http://localhost:8080/api/questions',{
            credentials: 'include'
          }),
        ])
        
        const classesData = await classesRes.json()
        const topicsData = await topicsRes.json()
        const questionsData = await questionsRes.json()
        
        setClasses(classesData)
        setTopics(topicsData)
        setQuestions(questionsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const questionsByClass = useMemo(() => {
    const countByClass = questions.reduce(
      (acc, q) => {
        acc[q.classId] = (acc[q.classId] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    return classes.map((c, index) => ({
      className: c.className,
      questions: countByClass[c.classId] || 0,
      color: COLORS[index % COLORS.length],
    }))
  }, [questions, classes])

  const questionsByTopic = useMemo(() => {
    const countByTopic = questions.reduce(
      (acc, q) => {
        acc[q.topicId] = (acc[q.topicId] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    return topics.map((t, index) => ({
      name: getShortTopicName(t.topicName),
      fullName: t.topicName,
      value: countByTopic[t.topicId] || 0,
      color: COLORS[index % COLORS.length],
    }))
  }, [questions, topics])

  const detailedData = useMemo(() => {
    return classes.map((c) => {
      const classQuestions = questions.filter((q) => q.classId === c.classId)
      const topicCounts = topics.reduce(
        (acc, t) => {
          const key = `topic_${t.topicId}`
          acc[key] = classQuestions.filter((q) => q.topicId === t.topicId).length
          return acc
        },
        {} as Record<string, number>,
      )

      return {
        className: c.className,
        ...topicCounts,
      }
    })
  }, [questions, classes, topics])

  const totalQuestions = questions.length
  const totalTopics = topics.length
  const totalClasses = classes.length
  const answeredQuestions = questions.filter((q) => q.status === "ANSWERED").length
  const answerRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto space-y-6">
          <Skeleton className="h-16 w-full" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-2/3 min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng câu hỏi</p>
                  <p className="text-2xl font-bold text-foreground">{totalQuestions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <BookOpen className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số chủ đề</p>
                  <p className="text-2xl font-bold text-foreground">{totalTopics}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <Users className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số lớp</p>
                  <p className="text-2xl font-bold text-foreground">{totalClasses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500/10">
                  <TrendingUp className="h-6 w-6 text-sky-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tỷ lệ trả lời</p>
                  <p className="text-2xl font-bold text-foreground">{answerRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="by-class">Theo lớp</TabsTrigger>
            <TabsTrigger value="by-topic">Theo chủ đề</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Câu hỏi theo lớp
                  </CardTitle>
                  <CardDescription>Phân bố số lượng câu hỏi theo từng lớp</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={questionsByClass} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="className" className="text-xs fill-muted-foreground" />
                        <YAxis className="text-xs fill-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--card-foreground))",
                          }}
                          formatter={(value: number) => [`${value} câu hỏi`, "Số lượng"]}
                        />
                        <Bar dataKey="questions" fill="hsl(210, 100%, 50%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-emerald-500" />
                    Câu hỏi theo chủ đề
                  </CardTitle>
                  <CardDescription>Tỷ lệ phân bố câu hỏi theo từng chủ đề</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={questionsByTopic}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {questionsByTopic.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--card-foreground))",
                          }}
                          formatter={(value: number, name: string, props: any) => [
                            `${value} câu hỏi`,
                            props.payload.fullName,
                          ]}
                        />
                        <Legend
                          formatter={(value, entry: any) => <span className="text-xs text-foreground">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="by-class">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết câu hỏi theo lớp</CardTitle>
                <CardDescription>Phân tích số lượng câu hỏi của từng chủ đề theo lớp</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={detailedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="className" className="text-xs fill-muted-foreground" />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--card-foreground))",
                        }}
                      />
                      <Legend />
                      {topics.map((topic, index) => (
                        <Bar
                          key={topic.topicId}
                          dataKey={`topic_${topic.topicId}`}
                          name={getShortTopicName(topic.topicName)}
                          fill={COLORS[index % COLORS.length]}
                          stackId="a"
                          radius={index === topics.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-topic">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Biểu đồ theo chủ đề</CardTitle>
                  <CardDescription>Số lượng câu hỏi của từng chủ đề</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={questionsByTopic}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" className="text-xs fill-muted-foreground" />
                        <YAxis dataKey="name" type="category" className="text-xs fill-muted-foreground" width={75} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--card-foreground))",
                          }}
                          formatter={(value: number, name: string, props: any) => [
                            `${value} câu hỏi`,
                            props.payload.fullName,
                          ]}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {questionsByTopic.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danh sách chủ đề</CardTitle>
                  <CardDescription>Xếp hạng các chủ đề theo số lượng câu hỏi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...questionsByTopic]
                      .sort((a, b) => b.value - a.value)
                      .map((topic, index) => {
                        const maxValue = Math.max(...questionsByTopic.map((t) => t.value))
                        return (
                          <div key={topic.name} className="flex items-center gap-4">
                            <Badge
                              variant="outline"
                              className="w-8 h-8 justify-center rounded-full text-sm font-semibold"
                              style={{
                                borderColor: COLORS[index % COLORS.length],
                                color: COLORS[index % COLORS.length],
                              }}
                            >
                              {index + 1}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-foreground text-sm truncate" title={topic.fullName}>
                                  {topic.fullName}
                                </span>
                                <span className="text-sm text-muted-foreground ml-2 shrink-0">
                                  {topic.value} câu hỏi
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: maxValue > 0 ? `${(topic.value / maxValue) * 100}%` : "0%",
                                    backgroundColor: COLORS[index % COLORS.length],
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
