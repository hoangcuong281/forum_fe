"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) =>{
    e.preventDefault();
    setLoading(true)
    setError(null)

    try{
      const res = await fetch('http://localhost:8080/api/auth/login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.message || 'Đăng nhập thất bại')
        setLoading(false)
        return
      }

      try {
        const checkRole = await fetch('http://localhost:8080/api/auth/me', { method: "GET", credentials: 'include' })
        if (checkRole.ok) {
          const user = await checkRole.json().catch(() => null)
          const role = user?.role ?? user?.roles ?? null
          const isAdmin = role === 'ADMIN' || (Array.isArray(role) && role.includes('ADMIN'))
          const isAdvisor = role === 'ADVISOR' || role === 'CVHT' || (Array.isArray(role) && (role.includes('ADVISOR') || role.includes('CVHT')))
          if (isAdmin) {
            window.dispatchEvent(new CustomEvent('authChanged'))
            router.push('/admin')
            return
          }
          if (isAdvisor) {
            window.dispatchEvent(new CustomEvent('authChanged'))
            router.push('/advisor')
            return
          }
        }
      } catch (e) {
        console.error('Failed to fetch current user after login', e)
      }
      setLoading(false)
      try {
        window.dispatchEvent(new CustomEvent('authChanged'))
      } catch {}

      router.push('/')
    }catch(error){
      console.error(error)
      setError('Lỗi khi liên hệ server')
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[74vh] w-full items-start justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
              <CardHeader>
              <CardTitle>Đăng nhập vào tài khoản của bạn</CardTitle>
              <CardDescription>
                  Nhập Mã sinh viên để đăng nhập vào tài khoản của bạn
              </CardDescription>
              </CardHeader>
              <CardContent>
              <form onSubmit={submit}>
                  <FieldGroup>
                  <Field>
                      <FieldLabel htmlFor="email">Mã sinh viên</FieldLabel>
                      <Input
                      id="email"
                      type="text"
                      placeholder="A12345"
                      onChange={e => setEmail(e.target.value)}
                      required
                      />
                  </Field>
                  <Field>
                      <div className="flex items-center">
                      <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                      <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                          Quên mật khẩu?
                      </a>
                      </div>
                      <Input 
                      id="password" 
                      type="password" 
                      onChange={e => setPassword(e.target.value)}
                      required
                      />
                  </Field>
                  <Field>
                      <Button type="submit" disabled={loading} className="bg-(--main-lightRed) border-[1px] border-transparent hover:bg-white hover:text-black hover:border-black cursor-pointer">
                      {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                      </Button>
                      <Button variant="outline" type="button" className="cursor-pointer">
                      Đăng nhập với Google
                      </Button>
                  </Field>
                  {error && (
                      <div role="alert" className="text-sm text-red-600">{error}</div>
                  )}
                  </FieldGroup>
              </form>
              </CardContent>
          </Card>
        </div>
    </div>
  )
}
