import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { authentication } from "../firebase-config";

const generateRecaptcha = () => {
  return new RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    },
    authentication
  );
};

function App() {
  const getCode = () => {
    //it will return the OTP entered by user
    return "1234";
  };

  const handleSubmit = (phoneNumber: number) => {
    if (isNaN(phoneNumber) || phoneNumber.toString().length !== 10) {
      //handle invalid phone number
    }

    signInWithPhoneNumber(authentication, `+91${phoneNumber}`, generateRecaptcha())
      .then((confirmationResult) => {
        console.log("confirmationResult => ", confirmationResult);

        confirmationResult
          .confirm(getCode())
          .then((result) => {
            // User signed in successfully.
            //const user = result.user;
            // ...
          })
          .catch((error) => {
            // User couldn't sign in (bad verification code?)
            // ...
          });

        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        // ...
      })
      .catch((error) => {
        console.log("error => ", error);
        // Error; SMS not sent
        // ...
      });
  };
  return (
    <div className="text-red-500">
      <button
        onClick={() => {
          handleSubmit(8126872525);
        }}
      >
        Click me
      </button>
      <div id="recaptcha-container"></div> {/* This div is required with this ID, otherwise generateRecaptcha will throw error */}
    </div>
  );
}

export default App;
