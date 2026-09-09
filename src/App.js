// function App() {
//   return (
//     <h1 className="text-3xl font-bold text-center mt-20">
//       Fintech App
//     </h1>
//   );
// }

// export default App;
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Eagerly loaded auth & route protectors
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./routes/protectedRoute";
import AdminProtectedRoute from "./routes/adminProtectedRoute";

// Code-split pages and feature components
const Register = lazy(() => import("./pages/Auth/Register"));
const AdminDashboard = lazy(() => import("./pages/Dashboard/AdminDashboard"));
const UserDashboard = lazy(() => import("./pages/Dashboard/UserDashboard"));
const Transfer = lazy(() => import("./pages/User/Transfer"));
const Security = lazy(() => import("./pages/User/Security"));
const Transactions = lazy(() => import("./pages/User/Transactions"));
const KYC = lazy(() => import("./pages/User/KYC"));
const Success = lazy(() => import("./pages/Payment/Success"));
const Cancel = lazy(() => import("./pages/Payment/Cancel"));
const Wallet = lazy(() => import("./pages/Wallet/Wallet").then((m) => ({ default: m.Wallet })));
const Airtime = lazy(() => import("./components/airtime/Airtime").then((m) => ({ default: m.Airtime })));
const Data = lazy(() => import("./components/data/Data").then((m) => ({ default: m.Data })));
const Bills = lazy(() => import("./pages/Bills/Bills"));
const Electricity = lazy(() => import("./components/electricity/Electricity"));
const Cable = lazy(() => import("./components/cable/Cable"));
const Internet = lazy(() => import("./components/internet/Internet"));
const Betting = lazy(() => import("./components/betting/Betting"));
const Education = lazy(() => import("./components/education/Education"));
const Insurance = lazy(() => import("./components/insurance/Insurance"));
const Schedule = lazy(() => import("./components/schedule/Schedule"));
const Beneficiaries = lazy(() => import("./components/beneficiary/Beneficiaries"));
const Statement = lazy(() => import("./components/statement/Statement"));
const Notifications = lazy(() => import("./components/notification/Notifications"));

const PageLoader = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin"></div>
        <span className="mt-3 text-xs font-medium text-slate-500 tracking-wider uppercase">Loading...</span>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                }}
            />
            <Suspense fallback={<PageLoader />}>
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

                <Route
                    path="/kyc"
                    element={
                        <ProtectedRoute>
                            <KYC />
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
        </Suspense>
        </BrowserRouter>
    );
}

export default App;

// https://dashboard.render.com/static/srv-dafei8lbedkc738u747g/redirects