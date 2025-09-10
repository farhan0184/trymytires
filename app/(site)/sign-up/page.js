
import CustomForm from "@/components/commons/CustomForm"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const fields = [
  {
    name: "name",
    title: "Name*",
    placeholder: "Enter your name",
    type: "text",
    variant: "input",
    className: "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
  },
  {
    name: "email",
    title: "Email*",
    placeholder: "Enter your email",
    type: "email",
    variant: "input",
    className: "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
  },
  {
    name: "password",
    title: "Password*",
    placeholder: "Enter your password",
    variant: "input",
    type: "password",
    className: "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
  },
  {
    name: "confirmPassword",
    title: "Confirm Password*",
    placeholder: "Re-enter your password",
    variant: "input",
    type: "password",
    className: "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
  },
]

 


export default function SignUpPage() {
  
  return (
    <Card className="w-full max-w-xl mx-auto my-20 border-0 shadow-none lg:p-0 p-3">
      <CardHeader>
        <CardTitle className={'text-center secondaryText'}>Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomForm formSchema={'signup'} fields={fields} btnCls={"w-full inputFieldHeight primaryText btnGradient text-white cursor-pointer"} btnTitle={"Sign Up"}/>
      </CardContent>
      <CardFooter className={"primaryText flex justify-center gap-2"}>
        Already Registered? <Link href="/sign-in" className="text-blue-500"> SignIn</Link>
      </CardFooter>
    </Card>
  )
}