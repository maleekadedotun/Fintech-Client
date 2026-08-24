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
// import {protectedRoute} from "./routes/protectedRoute";
// import Dashboard from "./pages/Dashboard";
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
// import Transactions from "./pages/User/Transactions";

function App() {
    return (

        // <div>
        //     <UserDashboard />
        // </div>
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


                {/* <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                /> */}
                <Route
                    path="/security"
                    element={<Security />}
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