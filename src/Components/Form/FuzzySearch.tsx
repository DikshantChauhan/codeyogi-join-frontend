import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";

interface FuzzySearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  touched?: boolean;
  error?: string;
  value: string;
  data: any;
  className?: string;
  searchKeys: string[];
  setValue: (value: string) => void;
  displayKey: string;
}

const FuzzySearch: React.FC<FuzzySearchProps> = ({ touched, error, displayKey, value, data, setValue, className, searchKeys, ...rest }) => {
  const options = {
    keys: searchKeys,
  };
  const fuse = new Fuse<any>(data, options);
  const results = fuse.search(value);

  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      } else {
        setShowResults(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className={"relative overflow-visible " + className} ref={wrapperRef}>
      <Input {...rest} touched={touched} error={error} value={value} className="mb-2" />

      {results.length > 0 && showResults && (
        <div className="absolute z-50 min-w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {results.map((result, index) => {
            if (index >= 10) return;
            return (
              <h1
                onClick={() => {
                  setValue(result.item[displayKey]);
                  setShowResults(false);
                }}
                key={index}
                className={"cursor-pointer hover:bg-gray-200 " + (index !== 3 ? "border-b border-gray-400  " : "")}
              >
                {result.item[displayKey]}
              </h1>
            );
          })}
        </div>
      )}
    </div>
  );
};

FuzzySearch.defaultProps = {};

export default React.memo(FuzzySearch);
