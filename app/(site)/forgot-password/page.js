
import CustomForm from "@/components/commons/CustomForm"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"





const fields = [
  {
    name: "email",
    title: "Email*",
    placeholder: "yourname@gmail.com",
    type: "email",
    variant: "input",
    className:
      "inputFieldHeight primaryText lg:placeholder:primaryText placeholder:italic",
  }
];

 


export default function ForgetPasswordPage() {


  return (
    <Card className="w-full max-w-xl mx-auto lg:my-56 my-32 border-0 shadow-none lg:p-0 p-3">
      <CardHeader>
        <CardTitle className={'text-center secondaryText'}>Forgot Password</CardTitle>
        <CardDescription className={'primaryText text-center'}>Please enter your email to reset the password</CardDescription>
      </CardHeader>
      <CardContent>

        <CustomForm formSchema={'forget_password'} fields={fields} btnCls={"w-full inputFieldHeight primaryText btnGradient text-white cursor-pointer"} btnTitle={"Verify Account"}/>

      </CardContent>
     
    </Card>
  )
}