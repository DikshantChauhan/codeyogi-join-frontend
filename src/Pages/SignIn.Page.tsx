import { FC, memo, useState } from "react";
import { generateRecaptcha, signIn } from "../APIs/auth.api";
import Input from "../Components/Form/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import SubmitButton from "../Components/SubmitButton";
import Logo from "../Components/Logo";
import { ROUTE_FORWARD_SLASH } from "../constants.routes";
import { useNavigate } from "react-router";
import Heading from "../Components/Heading";

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = () => {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isOTPSending, setIsOTPSending] = useState(false);
  const [isOTPSubmitting, setIsOTPSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSendSMS = async (phoneNumber?: string) => {
    if (!phoneNumber) {
      formik.setErrors({ ...formik.errors, phoneNumber: "Please enter your phone number!" });
      return;
    }

    if (isNaN(phoneNumber as any)) {
      formik.setErrors({ ...formik.errors, phoneNumber: "Please enter a valid phone number!" });
      return;
    }

    setIsOTPSending(true);

    try {
      const confirmationResult = await signIn(`+91${phoneNumber}`, generateRecaptcha("recaptcha-container"));
      window.confirmationResult = confirmationResult;

      setIsOTPSent(true);
    } catch (error) {
      console.log("error => ", error);

      setIsOTPSent(false);
      formik.setErrors({ ...formik.errors, phoneNumber: "OTP not sent, either retry or try after some time!" });
    }

    setIsOTPSending(false);
  };

  const handleOTP = async (OTP: string) => {
    setIsOTPSubmitting(true);
    try {
      await window.confirmationResult.confirm(OTP);
      navigate(ROUTE_FORWARD_SLASH);
    } catch (error) {
      formik.setErrors({ ...formik.errors, OTP: "OTP is not valid!" });
    }
    setIsOTPSubmitting(false);
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
        .matches(/^[0-9]\d{9}$/, { message: "Invalid Phone number" }),
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
      <div className="flex flex-col items-center justify-center max-w-2xl min-h-screen mx-auto">
        <Logo type="CodeYogiLogoEnglishBlack" size="5xl" />

        <Heading>Enter your phone number below to join/register with us</Heading>
        <h3 className={`text-red-500 sm:mt-2 mt-5`}>
          (<span className={`font-semibold`}>NOTE</span>: This phone number cannot be changed later)
        </h3>

        <form onSubmit={formik.handleSubmit} className={`mt-10 w-full max-w-lg`}>
          <div className={`flex `}>
            <label htmlFor="phoneNumber" className={`min-w-max mt-4`}>
              Phone number
            </label>

            <Input
              id="phoneNumber"
              type="number"
              placeholder="Phone Number"
              {...formik.getFieldProps("phoneNumber")}
              touched={formik.touched.phoneNumber}
              error={formik.errors.phoneNumber}
              value={formik.values.phoneNumber}
              className={`ml-4 w-full`}
              disabled={isOTPSent ? true : false}
            />
          </div>

          {isOTPSent && (
            <Input
              id="OTP"
              type="text"
              placeholder="OTP"
              {...formik.getFieldProps("OTP")}
              touched={formik.touched.OTP}
              error={formik.errors.OTP}
              value={formik.values.OTP}
              className={`mx-auto w-48`}
            />
          )}

          <SubmitButton className={`w-32`} isLoading={isOTPSending || isOTPSubmitting}>
            {isOTPSent ? "Submit OTP" : "Get OTP"}
          </SubmitButton>
        </form>
      </div>
      <div id="recaptcha-container"></div> {/* This div is required with this ID, otherwise generateRecaptcha will throw error */}
    </div>
  );
};

SignInPage.defaultProps = {};

export default memo(SignInPage);
