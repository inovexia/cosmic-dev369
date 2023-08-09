import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../pages";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import CreatePassword from "../pages/Auth/CreatePassword";
import Tests from "../pages/Tests/index";
import CreateTest from "../pages/Tests/createTest";
import EditTest from "../pages/Tests/editTest";
import AddQuestion from "../pages/Tests/addQuestion";
import AllQuestions from "../pages/Tests/allQuestions";
import EditQuestion from "../pages/Tests/editQuestion";
import ImportQuestion from "../pages/Tests/importQuestion";
import PreviewTest from "../pages/Tests/previewTest";
import ManageTest from "../pages/Tests/manageTest";
import EnrollTest from "../pages/Tests/enrollTest";
import Enrollments from "../pages/Tests/enrollments";
import TakeTest from "../pages/Tests/takeTest";
import TestSetting from "../pages/Tests/testSetting";
import SubmissionReports from "../pages/Tests/submissionReports";
import AllSubmissions from "../pages/Tests/AllSubmissions"
import OnlineClasses from "../pages/Classroom";
import CreateMeeting from "../pages/Classroom/CreateMeeting";
import EditMeeting from "../pages/Classroom/EditMeeting";
import ShareMeeting from "../pages/Classroom/ShareMeeting";
import StudentReport from "../pages/Tests/studentReport";
import Dashboard from "../pages/Students";
import Users from "../pages/Users";
import CreateUser from "../pages/Users/Create";
import ViewUser from "../pages/Users/ViewUser";
import EditUser from "../pages/Users/EditUser";
import ManageCourse from "../pages/Course/ManageCourse";
import Courses from "../pages/Course";
import CreateCourse from "../pages/Course/CreateCourse";
import UpdateCourse from "../pages/Course/UpdateCourse";
import Lesson from "../pages/Course/Lesson";
import CreateLesson from "../pages/Course/Lesson/CreateLesson";
import OrganizeLesson from "../pages/Course/Lesson/OrganizeLesson";
import Test from "../pages/Course/Test";
import AddTests from "../pages/Course/Test/AddTests";
import CreateCourseTest from "../pages/Course/Test/CreateCourseTest";
import Meetings from "../pages/Course/Meetings";
import AddCourseMeeting from "../pages/Course/Meetings/AddCourseMeeting";
import CreateCourseMeeting from "../pages/Course/Meetings/Create";
import EnrolledUsers from "../pages/Course/Enrollments/EnrolledUsers";
import EnrollUsers from "../pages/Course/Enrollments/EnrollUser";
import Students from "../pages/Users/Students";
import Settings from "../pages/Auth/Settings/Index";
import RedirectLogic from "../components/Redirect/RedirectLogic";


const AppRouter = () => {
  return (
    <Router>
      <RedirectLogic />
      <Routes>
        <Route path={"/"} element={<HomePage />} />
        <Route path={"/auth/login"} element={<Login />} />
        <Route path={"/auth/register"} element={<Register />} />
        <Route path={"/auth/forgot-password"} element={<ForgotPassword />} />
        <Route path={"/auth/create-password"} element={<CreatePassword />} />
        <Route path={"/test/list"} element={<Tests />} />
        <Route path={"/test/create"} element={<CreateTest />} />
        <Route path={"/test/edit/:guid"} element={<EditTest />} />
        <Route path={"/test/add-question/:guid"} element={<AddQuestion />} />
        <Route path={"/test/all-questions/:guid"} element={<AllQuestions />} />
        <Route path={"/test/edit-question/:guid"} element={<EditQuestion />} />
        <Route
          path={"/test/import-question/:guid"}
          element={<ImportQuestion />}
        />
        <Route path={"/test/preview-test/:guid"} element={<PreviewTest />} />
        <Route path={"/test/manage/:guid"} element={<ManageTest />} />
        <Route path={"/test/enrollments/:guid"} element={<Enrollments />} />
        <Route path={"/test/enroll/:guid"} element={<EnrollTest />} />
        <Route path={"/test/take-test/:guid"} element={<TakeTest />} />
        <Route path={"/test/setting/:guid"} element={<TestSetting />} />
        <Route path={"/test/report/:guid"} element={<SubmissionReports />} />
        <Route path={"/test/all-submissions/:guid"} element={<AllSubmissions />} />
        <Route path={"/online-classes"} element={<OnlineClasses />} />
        <Route path={"/meeting/create"} element={<CreateMeeting />} />
        <Route path={"/meeting/edit/:meetingGuid"} element={<EditMeeting />} />
        <Route
          path={"/meeting/share/:meetingGuid"}
          element={<ShareMeeting />}
        />
        <Route
          path={"/test/report/test-id/student-id"}
          element={<StudentReport />}
        />
        <Route path={"/student/dashboard"} element={<Dashboard />} />
        <Route path={"/user/list"} element={<Users />} />
        <Route path={"/user/create"} element={<CreateUser />} />
        <Route path={"/user/view/:userGuid"} element={<ViewUser />} />
        <Route path={"/user/edit/:userGuid"} element={<EditUser />} />
        <Route path={"/course/manage/:courseGuid"} element={<ManageCourse />} />
        <Route path={"/course/list"} element={<Courses />} />
        <Route path={"/course/create"} element={<CreateCourse />} />
        <Route path={"/course/update/:courseGuid"} element={<UpdateCourse />} />
        <Route path={"/course/:courseGuid/lessons"} element={<Lesson />} />
        <Route
          path={"/course/:courseGuid/lesson/create"}
          element={<CreateLesson />}
        />
        <Route
          path={"/course/:courseGuid/lesson/organize"}
          element={<OrganizeLesson />}
        />
        <Route path={"/course/:courseGuid/test/list"} element={<Test />} />
        <Route path={"/course/:courseGuid/test/add"} element={<AddTests />} />
        <Route
          path={"/course/:courseGuid/test/create"}
          element={<CreateCourseTest />}
        />
        <Route
          path={"/course/:courseGuid/meeting/list"}
          element={<Meetings />}
        />
        <Route
          path={"/course/:courseGuid/meeting/add"}
          element={<AddCourseMeeting />}
        />
        <Route
          path={"/course/:courseGuid/meeting/create"}
          element={<CreateCourseMeeting />}
        />
        <Route
          path={"/course/:courseGuid/enrolled-users"}
          element={<EnrolledUsers />}
        />
        <Route path={"/course/:courseGuid/enroll"} element={<EnrollUsers />} />
        <Route path={"/user/students"} element={<Students />} />
        <Route path={"/auth/settings"} element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
