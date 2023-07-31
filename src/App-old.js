//import logo from "./logo.svg";
import AppRouter from './routes'
import Layout from './Layout'
import "./App.css"
import "./assets/css/addQuestion.css"
import "./assets/css/meeting.css"
import "./assets/css/styleGuide.css"
import "./assets/css/dashboard.css"
import "./assets/css/course.css"

function App() {
  return (
    <Layout>
    <AppRouter />
    </Layout>
  );
}

export default App;
