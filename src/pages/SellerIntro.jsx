import { Link, useNavigate } from "react-router-dom";
import postImage from "../../src/assets/post.png";
import { useSelector } from "react-redux";

export const SellerIntro = () => {
  const { currentUser } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  function handlePostAdd() {
    if (currentUser?.role === "seller") {
      navigate("/seller");
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-2xl m-5">
      <img src={postImage} alt="post" className="w-96 mb-4" />

      <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
        <li>
          If you don’t have an account, please{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            register
          </Link>{" "}
          a seller account.
        </li>
        <li>Already have an account? Login to continue.</li>
      </ol>

      <button
        onClick={handlePostAdd}
        className="bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700 transition"
      >
        Post Your Ad
      </button>
    </div>
  );
};
