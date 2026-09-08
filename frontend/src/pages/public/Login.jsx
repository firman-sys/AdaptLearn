import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import api from "@/services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("userSession", JSON.stringify(data.session));
      storage.setItem("userProfile", JSON.stringify(data.profile));

      if (data.profile && data.profile.skill_level && data.profile.learning_style && !data.profile.needs_reassessment) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/welcome";
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid login credentials");
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
              Login to AdaptLearn
            </h2>
            <p className="text-sm text-gray-500">
              Please enter your details to access your account.
            </p>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

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

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="cursor-pointer"
            />
            <label htmlFor="rememberMe" className="cursor-pointer">Remember Me</label>
          </div>

          {/* Button */}
          <Button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {loading ? "Loading" : "Login"}
          </Button>

          {/* Bottom text */}
          <p className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-orange-500 cursor-pointer font-medium"
            >
              Register
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
