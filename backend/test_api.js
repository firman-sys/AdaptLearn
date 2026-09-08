import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api";
// Change to http://localhost:5000/api if testing locally
const API_BASE_URL = "https://adapt-learn-be.vercel.app/api";

async function testAPI() {
    console.log("checking if the api actually works...\n");

    try {
        console.log("checking yt videos for react");
        const videoRes = await axios.get(`${API_BASE_URL}/recommendations/video`, {
            params: { topic: "react" }
        });
        console.log("nice, got", videoRes.data.length, "videos");

        console.log("\nnow checking for some books");
        const textRes = await axios.get(`${API_BASE_URL}/recommendations/text`, {
            params: { topic: "react" }
        });
        console.log("found", textRes.data.length, "books fr");

        console.log("\ntrying to get the quiz questions...");
        const quizRes = await axios.get(`${API_BASE_URL}/quiz/questions`);

        let questions = quizRes.data;
        if (quizRes.data.data && Array.isArray(quizRes.data.data)) {
            questions = quizRes.data.data;
        }

        if (Array.isArray(questions)) {
            console.log("got the quiz, there's", questions.length, "questions here");
        } else {
            console.log("idk what this is but it's not a list:", quizRes.data);
        }

        console.log("\nsending the quiz test results...");
        const submitRes = await axios.post(`${API_BASE_URL}/quiz/submit`, {
            name: "arman",
            email: "arman@example.com",
            learning_style: "Visual",
            skill_level: "Beginner"
        });
        console.log("server:", submitRes.data.message);

    } catch (error) {
        console.error("bruh it's error:");
        if (error.response) {
            console.error("status code:", error.response.status);
            console.error("error message from server:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testAPI();
