
import CustomForm from "@/components/commons/CustomForm"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"





const fields = [
  {
    name: "password",
    title: "Password*",
    placeholder: "Enter your password",
    variant: "input",
    type: "password",
    className: "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
  },
  {
    name: "confirm_password",
    title: "Confirm Password*",
    placeholder: "Re-enter your password",
    variant: "input",
    type: "password",
    className: "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
  }
];

 


export default function ResetPasswordPage() {


  return (
    <Card className="w-full max-w-xl mx-auto lg:my-32 my-24 border-0 shadow-none lg:p-0 p-3">
      <CardHeader>
        <CardTitle className={'text-center secondaryText'}>Reset Password</CardTitle>
        <CardDescription className={'primaryText text-center'}>Please enter your new password</CardDescription>
      </CardHeader>
      <CardContent>

        <CustomForm formSchema={'reset_password'} fields={fields} btnCls={"w-full inputFieldHeight primaryText btnGradient  text-white cursor-pointer"} btnTitle={"Submit"}/>

      </CardContent>
     
    </Card>
  )
}