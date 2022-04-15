import { useFormik } from "formik";
import { FC, memo, useEffect, useState } from "react";
import Input from "../Components/Form/Input";
import SubmitButton from "../Components/SubmitButton";
import * as yup from "yup";
import FuzzySearch from "../Components/Form/FuzzySearch";
import { Institute } from "../Models/Institue";
import { fetchInstitutesListAPI } from "../APIs/institute.api";
import { discoverySoucresFetchAPI } from "../APIs/discoverySources.api";
import { meUpdateAPI } from "../APIs/auth.api";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

interface CompleteProfileProps {}

const CompleteProfile: FC<CompleteProfileProps> = ({}) => {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [discoverySources, setDiscoverySources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInstitutesListAPI().then((institutes) => {
      setInstitutes(institutes);
    });
    discoverySoucresFetchAPI().then((discoverySources) => {
      setDiscoverySources(discoverySources);
    });
  }, []);

  const formik = useFormik<{
    email: string;
    first_name: string;
    last_name: string;
    phone_number: number;
    institute_name: string;
    city_of_residence: string;
    discovery_source: string;
    "meta.institute": string | null;
    "meta.discoverySource": string | null;
  }>({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone_number: 0,
      institute_name: "",
      city_of_residence: "",
      discovery_source: "",
      "meta.institute": "",
      "meta.discoverySource": "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().trim().email("Please enter a valid email").required(),
      first_name: yup.string().trim().required(),
      last_name: yup.string().trim().required(),
      phone_number: yup
        .string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits"),
      institute_name: yup.string().trim().required(),
      city_of_residence: yup.string().trim().required(),
      discovery_source: yup.string().trim().required(),
      "meta.institute": yup.string().trim(),
      "meta.discoverySource": yup.string().trim(),
    }),
    onSubmit: async (data) => {
      const { institute_name, discovery_source, ...formData } = data;
      formData["meta.institute"] = "";
      formData["meta.discoverySource"] = "";

      const selectedInstitute = institutes.find((institute) => institute.name === institute_name);
      const discoverySourceExists = !!discoverySources.find((source) => source === discovery_source);

      const institute_id = selectedInstitute ? selectedInstitute.id : null;
      formData["meta.institute"] = selectedInstitute ? null : institute_name;

      const source = discoverySourceExists ? discovery_source : null;
      formData["meta.discoverySource"] = discoverySourceExists ? null : discovery_source;

      const profileData = { ...formData, institute_id, discovery_source: source };

      setIsLoading((loading) => !loading);
      await meUpdateAPI(profileData);
      setIsLoading((loading) => !loading);
    },
  });

  const setFormikInstituteName = async (institute_name: string) => {
    await formik.setValues({ ...formik.values, institute_name });
  };
  const setFormikDiscoverySources = async (discovery_source: string) => {
    await formik.setValues({ ...formik.values, discovery_source });
  };

  let searchAbleSources: any[] = [];
  discoverySources.forEach((source) => {
    searchAbleSources = [...searchAbleSources, { name: source }];
  });
  return (
    <div className={`h-full md:pt-10`}>
      <div style={{ height: "fit-content" }} className="inset-0 w-3/4 m-auto lg:w-1/2 lg:absolute">
        <h1 className="mb-10 text-4xl font-bold text-center">CODEYOGI</h1>

        <h1 className="text-3xl font-semibold ">Please Complete Your Profile</h1>

        <div className="mt-5 overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <form onSubmit={formik.handleSubmit}>
                <div className="items-center py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>

                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                    <Input
                      id="email"
                      type="text"
                      placeholder="Email"
                      {...formik.getFieldProps("email")}
                      touched={formik.touched.email}
                      error={formik.errors.email}
                      value={formik.values.email}
                      className="mb-2"
                    />
                  </dd>
                </div>

                <div className="flex ">
                  <div className="items-center py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">First Name</dt>

                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <Input
                        id="first_name"
                        type="text"
                        placeholder="First Name"
                        {...formik.getFieldProps("first_name")}
                        touched={formik.touched.first_name}
                        error={formik.errors.first_name}
                        value={formik.values.first_name}
                        className="mb-2"
                      />
                    </dd>
                  </div>

                  <div className="items-center py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pr-6">
                    <dt className="text-sm font-medium text-gray-500">Last Name</dt>

                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <Input
                        id="last_name"
                        type="text"
                        placeholder="Last Name"
                        {...formik.getFieldProps("last_name")}
                        touched={formik.touched.last_name}
                        error={formik.errors.last_name}
                        value={formik.values.last_name}
                        className="mb-2"
                      />
                    </dd>
                  </div>
                </div>

                <div className="items-center py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>

                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                    <Input
                      id="phone_number"
                      type="text"
                      placeholder="Phone Number"
                      {...formik.getFieldProps("phone_number")}
                      touched={formik.touched.phone_number}
                      error={formik.errors.phone_number}
                      value={formik.values.phone_number}
                      className="mb-2"
                    />
                  </dd>
                </div>

                <div className="items-center py-4 overflow-visible sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Institute Name</dt>

                  <dd className="mt-1 overflow-visible text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                    <FuzzySearch
                      id="institute_name"
                      type="text"
                      placeholder="Institute/College Name"
                      {...formik.getFieldProps("institute_name")}
                      touched={formik.touched.institute_name}
                      error={formik.errors.institute_name}
                      value={formik.values.institute_name}
                      setValue={setFormikInstituteName}
                      data={institutes}
                      displayKey="name"
                      searchKeys={["name", "aliases.alias"]}
                    />
                  </dd>
                </div>

                <div className="items-center py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">City Of Residence</dt>

                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                    <Input
                      id="city_of_residence"
                      type="text"
                      placeholder="City you live in"
                      {...formik.getFieldProps("city_of_residence")}
                      touched={formik.touched.city_of_residence}
                      error={formik.errors.city_of_residence}
                      value={formik.values.city_of_residence}
                      className="mb-2"
                    />
                  </dd>
                </div>

                <div className="items-center py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Discovery Source</dt>

                  <dd className="mt-1 overflow-visible text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                    <FuzzySearch
                      id="discovery_source"
                      type="text"
                      placeholder="How did you find us?"
                      {...formik.getFieldProps("discovery_source")}
                      touched={formik.touched.discovery_source}
                      error={formik.errors.discovery_source}
                      value={formik.values.discovery_source}
                      setValue={setFormikDiscoverySources}
                      data={searchAbleSources}
                      displayKey="name"
                      searchKeys={["name"]}
                    />
                  </dd>
                </div>

                <SubmitButton isLoading={isLoading} className="w-20 sm:w-32 sm:mb-10 sm:ml-5 ">
                  Submit
                </SubmitButton>
              </form>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CompleteProfile);
