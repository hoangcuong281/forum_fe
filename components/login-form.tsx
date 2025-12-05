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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [msv, setMSV] = useState('');
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) =>{
    e.preventDefault();
    setLoading(true)
    setError(null)

    try{
      const res = await fetch('https://dummyjson.com/auth/login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include', // include cookies from server
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.message || 'Đăng nhập thất bại')
        setLoading(false)
        return
      }

      // success — server should set a session cookie; redirect to home
      setLoading(false)
      router.push('/')
    }catch(error){
      console.error(error)
      setError('Lỗi khi liên hệ server')
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                <FieldLabel htmlFor="msv">Mã sinh viên</FieldLabel>
                <Input
                  id="msv"
                  type="msv"
                  placeholder="A12345"
                  onChange={e => setMSV(e.target.value)}
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
  )
}
