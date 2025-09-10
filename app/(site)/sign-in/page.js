
import CustomForm from "@/components/commons/CustomForm"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"





const fields = [
  {
    name: "identifier",
    title: "Email*",
    placeholder: "Enter your email",
    type: "email",
    variant: "input",
    className:
      "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
  },
  {
    name: "password",
    title: "Password*",
    placeholder: "Enter your password",
    variant: "input",
    type: "password",
    className:
      "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
  },
];

 


export default function SignInPage() {

  
  return (
    <Card className="w-full max-w-xl mx-auto lg:my-32 my-24 border-0 shadow-none lg:p-0 p-3">
      <CardHeader>
        <CardTitle className={'text-center secondaryText'}>Sign in</CardTitle>
      </CardHeader>
      <CardContent>

        <CustomForm formSchema={'signin'} fields={fields} btnCls={"w-full inputFieldHeight primaryText btnGradient text-white cursor-pointer"} btnTitle={"Login"}/>

      </CardContent>
      <CardFooter className={"primaryText flex justify-center gap-2"}>
        New to TryMyTires? <Link href="/sign-up" className="text-blue-500"> SignUp</Link>
      </CardFooter>
    </Card>
  )
}
