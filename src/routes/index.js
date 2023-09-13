import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import CreatePassword from '../pages/Auth/CreatePassword';
import NotFound from '../pages/404';
import Tests from '../pages/Tests/index';
import CreateTest from '../pages/Tests/createTest';
import EditTest from '../pages/Tests/editTest';
import AddQuestion from '../pages/Tests/addQuestion';
import AllQuestions from '../pages/Tests/allQuestions';
import EditQuestion from '../pages/Tests/editQuestion';
import ImportQuestion from '../pages/Tests/importQuestion';
import PreviewTest from '../pages/Tests/previewTest';
import ManageTest from '../pages/Tests/manageTest';
import EnrollTest from '../pages/Tests/enrollTest';
import Enrollments from '../pages/Tests/enrollments';
import TakeTest from '../pages/Tests/takeTest';
import TestSetting from '../pages/Tests/testSetting';
import SubmissionReports from '../pages/Tests/submissionReports';
import Report from '../pages/Tests/Report';
import AllSubmissions from '../pages/Tests/AllSubmissions';
import OnlineClasses from '../pages/Classroom';
import CreateMeeting from '../pages/Classroom/CreateMeeting';
import EditMeeting from '../pages/Classroom/EditMeeting';
import ShareMeeting from '../pages/Classroom/ShareMeeting';
import StudentReport from '../pages/Tests/studentReport';
import Dashboard from '../pages/Students';
import Users from '../pages/Users';
import CreateUser from '../pages/Users/Create';
import ViewUser from '../pages/Users/ViewUser';
import EditUser from '../pages/Users/EditUser';
import ManageCourse from '../pages/Course/ManageCourse';
import Courses from '../pages/Course';
import CreateCourse from '../pages/Course/CreateCourse';
import UpdateCourse from '../pages/Course/UpdateCourse';
// import Lesson from '../pages/Course/Subject';
import Lessons from '../pages/Course/Subject/Lesson';
import CreateLesson from '../pages/Course/Subject/Lesson/CreateLesson';
import Test from '../pages/Course/Test';
import Categories from '../pages/Tests/Categories';
import AllCategoryTests from '../pages/Tests/Categories/AllCategoryTests';
import LinkTestCategory from '../pages/Tests/Categories/LinkTestCategory';
import AddTests from '../pages/Course/Test/AddTests';
import CourseTestEdit from '../pages/Course/Test/CourseTestEdit';
import AddCourseTestQues from '../pages/Course/Test/AddQuestions';
import PreviewTestCourse from '../pages/Course/Test/PreviewTest';
import CourseTestManage from '../pages/Course/Test/CourseTestManage';
import CourseEditQuestion from '../pages/Course/Test/CourseEditQuestion';
import CourseTestPreview from '../pages/Course/Test/CourseTestPreview';
import CreateCourseTest from '../pages/Course/Test/CreateCourseTest';
import Meetings from '../pages/Course/Meetings';
import AddCourseMeeting from '../pages/Course/Meetings/AddCourseMeeting';
import CreateCourseMeeting from '../pages/Course/Meetings/Create';
import EnrolledUsers from '../pages/Course/Enrollments/EnrolledUsers';
import EnrollUsers from '../pages/Course/Enrollments/EnrollUser';
import Students from '../pages/Users/Students';
import Settings from '../pages/Auth/Settings/Index';
import RedirectLogic from '../components/Redirect/RedirectLogic';
import MyAccount from '../../src/pages/Auth/MyAccount';
import Subjects from '../pages/Course/Subject';
import CreateSubject from '../pages/Course/Subject/CreateSubject';
import UpdateSubject from '../pages/Course/Subject/UpdateSubject';
import SingleSubject from '../pages/Course/Subject/SingleSubject';
import CreateContent from 'pages/Course/Subject/Content/CreateContent';

const AppRouter = () => {
  return (
    // <Router basename="/dev">
    <Router>
      <RedirectLogic />
      <Routes>
        {/* <Route path={"/"} element={<Loader />} /> */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path={"/dashboard"} element={<HomePage />} />
        <Route path={"/auth/login"} element={<Login />} />
        <Route path={"/auth/register"} element={<Register />} />
        <Route path={"/auth/forgot-password"} element={<ForgotPassword />} />
        <Route path={"/auth/create-password"} element={<CreatePassword />} />
        <Route path={"/test/list"} element={<Tests />} />
        <Route path={"/test/create"} element={<CreateTest />} />
        <Route path={"/test/edit/:guid"} element={<EditTest />} />
        <Route path={"/test/add-question/:guid"} element={<AddQuestion />} />
        <Route
          path={"/test/edit-question/:guid/:qid"}
          element={<EditQuestion />}
        />
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
        <Route path={"/test/submission-report/:guid"} element={<Report />} />
        <Route
          path={"/test/all-submissions/:guid"}
          element={<AllSubmissions />}
        />
        <Route path={"/test/category/list"} element={<Categories />} />
        <Route
          path={"/test/category/tests/:guid"}
          element={<AllCategoryTests />}
        />
        <Route
          path={"/test/category/link-test/:guid"}
          element={<LinkTestCategory />}
        />
        <Route path={"/online-classes"} element={<OnlineClasses />} />
        <Route path={"/class/create"} element={<CreateMeeting />} />
        <Route path={"/class/edit/:meetingGuid"} element={<EditMeeting />} />
        <Route path={"/class/share/:meetingGuid"} element={<ShareMeeting />} />
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
        <Route path={"/course/test/edit/:guid"} element={<CourseTestEdit />} />
        <Route
          path={"/course/test/add-question/:guid"}
          element={<AddCourseTestQues />}
        />
        <Route
          path={"/course/test/edit-question/:guid/:qid"}
          element={<CourseEditQuestion />}
        />
        <Route
          path={"/course/test/preview/:guid"}
          element={<CourseTestPreview />}
        />
        <Route
          path={"/course/test/preview/:guid"}
          element={<PreviewTestCourse />}
        />
        <Route
          path={"/course/test/manage/:guid"}
          element={<CourseTestManage />}
        />
        <Route path={"/course/update/:courseGuid"} element={<UpdateCourse />} />
        <Route
          path={"/course/:courseGuid/lesson/create"}
          element={<CreateLesson />}
        />
        <Route
          path={"/course/:courseGuid/:subjectId/lessons"}
          element={<Lessons />}
        />
        <Route
          path={"/course/:courseGuid/subject/:subjectID/preview"}
          element={<SingleSubject />}
        />
        <Route
          path={"/course/:courseGuid/:subjectId/lesson/create"}
          element={<CreateLesson />}
        />
        <Route
          path={"/course/:courseGuid/subject/:subjectID/content/create"}
          element={<CreateContent />}
        />
        <Route path={"/course/:courseGuid/test/list"} element={<Test />} />
        <Route path={"/course/:courseGuid/test/add"} element={<AddTests />} />
        <Route
          path={"/course/:courseGuid/test/create"}
          element={<CreateCourseTest />}
        />
        <Route path={"/course/:courseGuid/class/list"} element={<Meetings />} />
        <Route
          path={"/course/:courseGuid/class/add"}
          element={<AddCourseMeeting />}
        />
        <Route
          path={"/course/:courseGuid/class/create"}
          element={<CreateCourseMeeting />}
        />
        <Route
          path={"/course/:courseGuid/enrolled-users"}
          element={<EnrolledUsers />}
        />
        <Route path={"/course/:courseGuid/enroll"} element={<EnrollUsers />} />
        <Route path={"/course/:courseGuid/subjects"} element={<Subjects />} />
        <Route
          path={"/course/:courseGuid/subject/create"}
          element={<CreateSubject />}
        />
        <Route
          path={"/course/:courseGuid/subject/edit/:subjectGuid"}
          element={<UpdateSubject />}
        />

        <Route path={"/user/students"} element={<Students />} />
        <Route path={"/auth/settings"} element={<Settings />} />
        <Route path={"auth/my-account"} element={<MyAccount />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
