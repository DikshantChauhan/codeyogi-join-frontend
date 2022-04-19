import { FC, memo, useContext, useState } from "react";
import { generateRecaptcha, signIn } from "../APIs/auth.api";
import { userContext } from "../Contexts/user.Context";
import Input from "../Components/Form/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import SubmitButton from "../Components/SubmitButton";

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = () => {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const user = useContext(userContext);

  const handleSendSMS = async (phoneNumber?: string) => {
    if (!phoneNumber) {
      formik.setErrors({ ...formik.errors, phoneNumber: "Please enter your phone number!" });
      return;
    }

    if (isNaN(phoneNumber as any)) {
      formik.setErrors({ ...formik.errors, phoneNumber: "Please enter a valid phone number!" });
      return;
    }

    try {
      const confirmationResult = await signIn(`+91${phoneNumber}`, generateRecaptcha("recaptcha-container"));

      window.confirmationResult = confirmationResult;
      setIsOTPSent(true);
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      // ...
    } catch (error) {
      console.log("error => ", error);
      setIsOTPSent(false);
      formik.setErrors({ ...formik.errors, phoneNumber: "OTP not sent, either retry or try after some time!" });
      // Error; SMS not sent
      // ...
    }
  };

  const handleOTP = async (OTP: string) => {
    try {
      const result = await window.confirmationResult.confirm(OTP);
      // User signed in successfully.
      //const user = result.user;
      //....
    } catch (error) {
      formik.setErrors({ ...formik.errors, OTP: "OTP is not valid!" });
      // User couldn't sign in (bad verification code?)
      // ...
    }
  };

  const formik = useFormik<{
    phoneNumber: string;
    OTP?: string;
  }>({
    initialValues: {
      phoneNumber: "",
      OTP: "",
    },
    validationSchema: yup.object().shape({
      phoneNumber: yup
        .string()
        .required("Enter your Phone number")
        .matches(/^[6-9]\d{9}$/, { message: "Invalid Phone number" }),
      OTP: yup.string().optional(),
    }),
    onSubmit: async (data) => {
      if (!data.OTP && !isOTPSent) {
        handleSendSMS(data.phoneNumber);
      }
      if (isOTPSent) {
        if (!data.OTP) {
          formik.setErrors({ ...formik.errors, OTP: "Enter your OTP" });
          return;
        } else {
          handleOTP(data.OTP);
        }
      }
    },
  });

  return (
    <div className="mx-2">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col items-center justify-center min-h-screen max-w-sm mx-auto">
          {!isOTPSent && (
            <Input
              id="phoneNumber"
              type="number"
              placeholder="Phone Number"
              {...formik.getFieldProps("phoneNumber")}
              touched={formik.touched.phoneNumber}
              error={formik.errors.phoneNumber}
              value={formik.values.phoneNumber}
              className="mb-10 w-full"
            />
          )}
          {isOTPSent && (
            <Input
              id="OTP"
              type="text"
              placeholder="OTP"
              {...formik.getFieldProps("OTP")}
              touched={formik.touched.OTP}
              error={formik.errors.OTP}
              value={formik.values.OTP}
              className="mb-10 w-full"
            />
          )}
          <SubmitButton>{isOTPSent ? "Submit OTP" : "Get OTP"}</SubmitButton>
        </div>
      </form>
      <div id="recaptcha-container"></div> {/* This div is required with this ID, otherwise generateRecaptcha will throw error */}
    </div>
  );
};

SignInPage.defaultProps = {};

export default memo(SignInPage);
