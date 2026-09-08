import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import api from "@/services/api";

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      if (data.session) {
        localStorage.setItem("userSession", JSON.stringify(data.session));
        localStorage.setItem("userProfile", JSON.stringify(data.profile));
        sessionStorage.setItem("userSession", JSON.stringify(data.session));
        sessionStorage.setItem("userProfile", JSON.stringify(data.profile));
      }
      
      // Force immediate redirect to welcome
      window.location.href = "/welcome";
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5efe6]">
      <Card className="w-96 shadow-lg">
        <CardContent className="p-8 space-y-5">
          {/* Title */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-gray-800">
              Register for AdaptLearn
            </h2>
            <p className="text-sm text-gray-500">
              Create your account to start your learning journey.
            </p>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* Username */}
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your username"
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-600">Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <input type="checkbox" />
            <span>I agree to the Terms of Service</span>
          </div>

          {/* Button */}
          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {loading ? "Loading" : "Register"}
          </Button>

          {/* Bottom */}
          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-orange-500 cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
