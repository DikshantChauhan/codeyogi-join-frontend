import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  className?: string;
  getDate?: (date: Date | undefined) => void;
  getddmmyyyyDate?: (date: string) => void
}

const Calander: React.FC<Props> = ({ className, getDate, getddmmyyyyDate }) => {
  const [startDate, setStartDate] = useState<any>(undefined);
  const ddmmyyyyDate = (date: Date | undefined) => {
    const dd = date && date.getDate();
    const mm = date && date.getMonth() + 1;
    const yy = date && date.getFullYear();
    const query = `${dd?.toString().length === 1 ? "0" + dd : dd}-${mm?.toString().length === 1 ? "0" + mm : mm}-${yy}`;
    return query;
  };
  return (
    <DatePicker
      selected={startDate}
      onChange={(date: any) => {
        setStartDate(date);
        getDate && date && getDate(date);
        getddmmyyyyDate && getddmmyyyyDate(ddmmyyyyDate(date));
      }}
      className={`${className}`}
    />
  );
};

Calander.defaultProps = {};

export default React.memo(Calander);
