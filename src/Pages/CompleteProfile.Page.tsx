import { useFormik } from "formik";
import { FC, memo, useContext, useEffect, useState } from "react";
import Input from "../Components/Form/Input";
import SubmitButton from "../Components/SubmitButton";
import * as yup from "yup";
import FuzzySearch from "../Components/Form/FuzzySearch";
import { Institute } from "../Models/Institue";
import { fetchInstitutesListAPI } from "../APIs/institute.api";
import { discoverySoucresFetchAPI } from "../APIs/discoverySources.api";
import { meUpdateAPI } from "../APIs/auth.api";
import { userContext } from "../Contexts/user.contextt";
import Heading from "../Components/Heading";
import { useNavigate } from "react-router";
import { ROUTE_FORWARD_SLASH, ROUTE_SLOTS } from "../constants.routes";

interface CompleteProfileProps {}

const CompleteProfile: FC<CompleteProfileProps> = ({}) => {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [discoverySources, setDiscoverySources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  if (!user) return <></>;

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
    institute_name: string;
    city_of_residence: string;
    discovery_source: string;
  }>({
    initialValues: {
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      institute_name: user.institute_name || "",
      city_of_residence: user.city_of_residence || "",
      discovery_source: user.discovery_source || "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().trim().email("Please enter a valid email").required(),
      first_name: yup.string().trim().required(),
      last_name: yup.string().trim().required(),
      institute_name: yup.string().trim().required(),
      city_of_residence: yup.string().trim().required(),
      discovery_source: yup.string().trim().required(),
    }),
    onSubmit: async (data) => {
      setIsLoading((loading) => !loading);

      try {
        const updatedUser = await meUpdateAPI(data);
        if (updatedUser) {
          setUser(updatedUser);
        }
      } catch (error) {
        console.error(error);
      }

      navigate(ROUTE_FORWARD_SLASH);
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
    <div className={`py-10`}>
      <div className="inset-0 w-3/4 m-auto lg:w-1/2 ">
        <Heading>Please Complete Your Profile</Heading>

        <h3 className={`text-red-500 mt-2`}>(All the fields are required)</h3>

        <div className="mt-2 overflow-hidden bg-white border border-gray-200 border-opacity-50 shadow sm:rounded-lg">
          <dl className="px-4 py-2 py-sm:divide-y sm:divide-gray-200">
            <form onSubmit={formik.handleSubmit}>
              <div className="items-center py-1 sm:py-3 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>

                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                  <Input
                    required
                    id="email"
                    type="text"
                    placeholder="Email"
                    {...formik.getFieldProps("email")}
                    touched={formik.touched.email}
                    error={formik.errors.email}
                    value={formik.values.email}
                  />
                </dd>
              </div>

              <div className="flex flex-col sm:flex-row">
                <div className="items-center flex-1 py-1 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">First Name</dt>

                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <Input
                      required
                      id="first_name"
                      type="text"
                      placeholder="First Name"
                      {...formik.getFieldProps("first_name")}
                      touched={formik.touched.first_name}
                      error={formik.errors.first_name}
                      value={formik.values.first_name}
                    />
                  </dd>
                </div>

                <div className="items-center flex-1 py-1 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:pr-6">
                  <dt className="text-sm font-medium text-gray-500">Last Name</dt>

                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <Input
                      required
                      id="last_name"
                      type="text"
                      placeholder="Last Name"
                      {...formik.getFieldProps("last_name")}
                      touched={formik.touched.last_name}
                      error={formik.errors.last_name}
                      value={formik.values.last_name}
                    />
                  </dd>
                </div>
              </div>

              <div className="items-center py-1 sm:py-3 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>

                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                  <Input
                    disabled
                    id="phone_no"
                    type="number"
                    placeholder="Phone Number"
                    {...formik.getFieldProps("phone_no")}
                    touched={false}
                    error={undefined}
                    value={+user.phone_no}
                  />
                </dd>
              </div>

              <div className="items-center py-4 overflow-visible sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Institute Name</dt>

                <dd className="mt-1 overflow-visible text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                  <FuzzySearch
                    required
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

              <div className="items-center py-1 sm:py-3 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">City Of Residence</dt>

                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                  <Input
                    required
                    id="city_of_residence"
                    type="text"
                    placeholder="City you live in"
                    {...formik.getFieldProps("city_of_residence")}
                    touched={formik.touched.city_of_residence}
                    error={formik.errors.city_of_residence}
                    value={formik.values.city_of_residence}
                  />
                </dd>
              </div>

              <div className="items-center py-4 overflow-visible sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Discovery Source</dt>

                <dd className="mt-1 overflow-visible text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                  <FuzzySearch
                    required
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
  );
};

export default memo(CompleteProfile);
