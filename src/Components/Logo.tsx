import React from "react";
import { Link } from "react-router-dom";
import CodeyogiLogoBlack from "../assets/img/CodeYogiLogoBlack.svg";
import CodeYogiLogoEnglishBlack from "../assets/img/CodeYogiLogoEnglishBlack.svg";
import CodeYogiLogoEnglishWhite from "../assets/img/CodeYogiLogoEnglishWhite.svg";
import CodeYogiLogoEnglishWhiteBg from "../assets/img/CodeYogiLogoEnglishWhiteBg.svg";
import CodeYogiLogoHindiBlack from "../assets/img/CodeYogiLogoHindiBlack.svg";
import CodeYogiLogoHindiWhite from "../assets/img/CodeYogiLogoHindiWhite.svg";
import CodeYogiLogoWhite from "../assets/img/CodeYogiLogoWhite.svg";
import CodeYogiLogoWhiteBg from "../assets/img/CodeYogiLogoWhiteBg.svg";
import { ROUTE_FORWARD_SLASH } from "../constants.routes";

const logos = {
  CodeyogiLogoBlack,
  CodeYogiLogoEnglishBlack,
  CodeYogiLogoEnglishWhite,
  CodeYogiLogoEnglishWhiteBg,
  CodeYogiLogoHindiBlack,
  CodeYogiLogoHindiWhite,
  CodeYogiLogoWhite,
  CodeYogiLogoWhiteBg,
};

interface LogoProps {
  className?: string;
  type:
    | "CodeyogiLogoBlack"
    | "CodeYogiLogoEnglishBlack"
    | "CodeYogiLogoEnglishWhite"
    | "CodeYogiLogoEnglishWhiteBg"
    | "CodeYogiLogoHindiBlack"
    | "CodeYogiLogoHindiWhite"
    | "CodeYogiLogoWhite"
    | "CodeYogiLogoWhiteBg";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

const Logo: React.FC<LogoProps> = ({ className, type, size }) => {
  let sizeClass = "";
  switch (size) {
    case "xs":
      sizeClass = "w-3 h-3";
      break;

    case "sm":
      sizeClass = "w-6 h-6";
      break;

    case "md":
      sizeClass = "w-10 h-10";
      break;

    case "lg":
      sizeClass = "w-12 h-12";
      break;

    case "xl":
      sizeClass = "w-16 h-16";
      break;

    case "2xl":
      sizeClass = "w-20 h-20";
      break;

    case "3xl":
      sizeClass = "w-24 h-24";
      break;

    case "4xl":
      sizeClass = "w-28 h-28";
      break;

    default:
      break;
  }
  return (
    <Link to={ROUTE_FORWARD_SLASH} className={` ${className}`}>
      <img src={logos[type]} alt="Codeyogi logo" className={`${sizeClass}`} />
    </Link>
  );
};

Logo.defaultProps = {};

export default React.memo(Logo);
