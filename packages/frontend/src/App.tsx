import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SplashPage from "./components/SplashPage";
import TrackPage from "./components/TrackPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
  },
  {
    path: "/track",
    element: <TrackPage />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;