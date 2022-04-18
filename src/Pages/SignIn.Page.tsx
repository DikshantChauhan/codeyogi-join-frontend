import { FC, memo, useContext, useState } from "react";
import { generateRecaptcha, signIn } from "../APIs/auth.api";
import { userContext } from "../Contexts/user.Context";

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = () => {
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [OTP, setOTP] = useState("");
  const user = useContext(userContext);

  const handleSendSMS = async (phoneNumber: number) => {
    if (isNaN(phoneNumber) || phoneNumber.toString().length !== 10) {
      //handle invalid phone number
    }

    try {
      const confirmationResult = await signIn(`+91${phoneNumber}`, generateRecaptcha("recaptcha-container"));
      console.log("confirmationResult => ", confirmationResult);
      window.confirmationResult = confirmationResult;
      setIsOTPSent(true);
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      // ...
    } catch (error) {
      console.log("error => ", error);
      // Error; SMS not sent
      // ...
    }
  };

  const handleOTP = async () => {
    try {
      const result = await window.confirmationResult.confirm(OTP);
      // User signed in successfully.
      //const user = result.user;
      // ...
    } catch (error) {
      // User couldn't sign in (bad verification code?)
      // ...
    }
  };

  return (
    <div className="text-red-500">
      {!isOTPSent && (
        <div>
          <input
            className="border border-black"
            type="number"
            value={userPhoneNumber}
            onChange={(e) => {
              setUserPhoneNumber(e.target.value);
            }}
          />
          <button
            onClick={() => {
              handleSendSMS(+userPhoneNumber);
            }}
          >
            Get OTP
          </button>
        </div>
      )}
      {isOTPSent && (
        <div>
          <input
            className="border border-green-600"
            type="text"
            value={OTP}
            onChange={(e) => {
              setOTP(e.target.value);
            }}
          />
          <button
            onClick={() => {
              handleOTP();
            }}
          >
            Send OTP
          </button>
        </div>
      )}
      <div id="recaptcha-container"></div> {/* This div is required with this ID, otherwise generateRecaptcha will throw error */}
    </div>
  );
};

SignInPage.defaultProps = {};

export default memo(SignInPage);
