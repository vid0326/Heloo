import { Navigate, useLocation } from "react-router-dom";
import { useGetLoggedInUserQuery } from "../authAPI";
import { motion } from "framer-motion";

const Protected = ({ children }) => {
    const { data: user, isLoading: isGettingLoggedInUser, isSuccess: gettingLoggedInUserSuccess, isError: isGettingLoggedInUserError, error: gettingLoggedInUserError } = useGetLoggedInUserQuery();
    const location = useLocation();

    if (isGettingLoggedInUser) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"
                />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}

export default Protected;   