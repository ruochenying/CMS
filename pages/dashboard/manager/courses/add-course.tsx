import { Steps, Result, Button } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";
import { useUserRole } from "../../../../components/custom-hooks/Login-state";

import AddCourse from "../../../../components/course/AddCourse";
import DashBoardLayout from "../../../../components/DashboardLayout";
import { Course } from "../../../../lib/model";
import UpdateChapter from "../../../../components/course/UpdateChapter";

const { Step } = Steps;

const Page = (props) => {
  const [step, setStep] = useState(0);
  const [course, setCourse] = useState<Course>(null);
  const router = useRouter();
  const userRole = useUserRole();

  const next = () => {
    setStep(step + 1);
  };

  return (
    <DashBoardLayout>
      <Steps
        current={step}
        type="navigation"
        // onChange={(e) => {
        //   setStep(e);
        // }}
        style={{ padding: "0 15px", margin: "20px 0" }}
      >
        <Step title="Course Detail" />
        <Step title="Course Schedule" />
        <Step title="Success" />
      </Steps>
      {step === 0 && (
        <AddCourse
          onSuccess={(course: Course) => {
            if (course) {
              setCourse(course);
              next();
            }
          }}
        />
      )}
      {step === 1 && <UpdateChapter {...{ ...course, next }} />}
      {step === 2 && (
        <Result
          status="success"
          title="Successfully Create Course!"
          extra={[
            <Button
              type="primary"
              key="detail"
              onClick={() =>
                router.push(`/dashboard/${userRole}/courses/${course.id}`)
              }
            >
              Go Course
            </Button>,
            <Button
              key="again"
              onClick={() => {
                router.reload();
              }}
            >
              Create Again
            </Button>,
          ]}
        />
      )}
    </DashBoardLayout>
  );
};

export default Page;

// export const getStaticProps: GetStaticProps = async (
//   context: GetStaticPropsContext
// ) => {
//   const data = await getCourseCode();
//   // const { data } = await axios.get(
//   //   "https://jsonplaceholder.typicode.com/todos/1"
//   // );

//   return {
//     props: {
//       courseCode: pickBy(data, (v) => v !== undefined),
//     },
//   };
// };
