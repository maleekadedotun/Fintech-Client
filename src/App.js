// function App() {
//   return (
//     <h1 className="text-3xl font-bold text-center mt-20">
//       Fintech App
//     </h1>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Auth/Login";
import ProtectedRoute from "./routes/protectedRoute";
import AdminProtectedRoute from "./routes/adminProtectedRoute";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import Transfer from "./pages/User/Transfer";
import Security from "./pages/User/Security";
import Transactions from "./pages/User/Transactions";
import Success from "./pages/Payment/Success";
import Cancel from "./pages/Payment/Cancel";
import { Wallet } from "./pages/Wallet/Wallet";
import { Airtime } from "./components/airtime/Airtime";
import { Data } from "./components/data/Data";

// Newly Connected Feature Components & Pages
import Bills from "./pages/Bills/Bills";
import Electricity from "./components/electricity/Electricity";
import Cable from "./components/cable/Cable";
import Internet from "./components/internet/Internet";
import Betting from "./components/betting/Betting";
import Education from "./components/education/Education";
import Insurance from "./components/insurance/Insurance";
import Schedule from "./components/schedule/Schedule";
import Beneficiaries from "./components/beneficiary/Beneficiaries";
import Statement from "./components/statement/Statement";
import Notifications from "./components/notification/Notifications";
import Register from "./pages/Auth/Register";

function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                }}
            />
            <Routes>
                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/security"
                    element={
                        <ProtectedRoute>
                            <Security />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/wallet"
                    element={
                        <ProtectedRoute>
                            <Wallet />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transfer"
                    element={
                        <ProtectedRoute>
                            <Transfer />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />

                {/* Airtime */}
                <Route
                    path="/airtime"
                    element={
                        <ProtectedRoute>
                            <Airtime />
                        </ProtectedRoute>
                    }
                />

                {/* Data */}
                <Route
                    path="/data"
                    element={
                        <ProtectedRoute>
                            <Data />
                        </ProtectedRoute>
                    }
                />

                {/* Bills Hub */}
                <Route
                    path="/bills"
                    element={
                        <ProtectedRoute>
                            <Bills />
                        </ProtectedRoute>
                    }
                />

                {/* Electricity */}
                <Route
                    path="/electricity"
                    element={
                        <ProtectedRoute>
                            <Electricity />
                        </ProtectedRoute>
                    }
                />

                {/* Cable TV */}
                <Route
                    path="/cable"
                    element={
                        <ProtectedRoute>
                            <Cable />
                        </ProtectedRoute>
                    }
                />

                {/* Internet */}
                <Route
                    path="/internet"
                    element={
                        <ProtectedRoute>
                            <Internet />
                        </ProtectedRoute>
                    }
                />

                {/* Betting */}
                <Route
                    path="/betting"
                    element={
                        <ProtectedRoute>
                            <Betting />
                        </ProtectedRoute>
                    }
                />

                {/* Education */}
                <Route
                    path="/education"
                    element={
                        <ProtectedRoute>
                            <Education />
                        </ProtectedRoute>
                    }
                />

                {/* Insurance */}
                <Route
                    path="/insurance"
                    element={
                        <ProtectedRoute>
                            <Insurance />
                        </ProtectedRoute>
                    }
                />

                {/* Schedules / Autopay */}
                <Route
                    path="/schedule"
                    element={
                        <ProtectedRoute>
                            <Schedule />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/schedules"
                    element={
                        <ProtectedRoute>
                            <Schedule />
                        </ProtectedRoute>
                    }
                />

                {/* Beneficiaries */}
                <Route
                    path="/beneficiaries"
                    element={
                        <ProtectedRoute>
                            <Beneficiaries />
                        </ProtectedRoute>
                    }
                />

                {/* Statement */}
                <Route
                    path="/statement"
                    element={
                        <ProtectedRoute>
                            <Statement />
                        </ProtectedRoute>
                    }
                />

                {/* Notifications */}
                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/success"
                    element={
                        <ProtectedRoute>
                            <Success />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cancel"
                    element={
                        <ProtectedRoute>
                            <Cancel />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

// https://dashboard.render.com/static/srv-dafei8lbedkc738u747g/redirects