import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex h-[74vh] w-full items-start justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
