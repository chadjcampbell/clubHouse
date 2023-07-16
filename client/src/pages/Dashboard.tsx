import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentCard from "../components/CommentCard";

export type UserType = {
  _id: string;
  name: string;
  email: string;
  isMember: boolean;
  isAdmin: boolean;
};

export type PostType = {
  createdAt: string;
  message: string;
  updatedAt: string;
  user: UserType;
  _id: string;
};

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostType[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/getUser"
        );
        setUser(response.data);
      } catch (error: any) {
        toast.warning("Log in to make a post");
      }
    };
    const getPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/messages");
        setPosts(response.data);
      } catch (error: any) {
        toast.error("No club posts found");
      }
    };
    getUser();
    getPosts();
    setLoading(false);
  }, []);

  const logout = async () => {
    await axios.get("http://localhost:3000/api/users/logout");
    navigate("/");
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <section className="mb-40">
      <nav
        className="relative flex w-full items-center justify-between bg-white py-2 shadow-sm shadow-neutral-700/10 dark:bg-neutral-800 dark:shadow-black/30 lg:flex-wrap lg:justify-start"
        data-te-navbar-ref
      >
        <div className="flex w-full flex-wrap items-center justify-between px-6">
          <div className="flex items-center">
            <Link to="/dashboard">
              <img
                className="h-10 w-10"
                src="/treehouse.webp"
                alt="clubhouse logo"
              />
            </Link>
          </div>

          {user ? (
            <div className="my-1 flex items-center lg:my-0 lg:ml-auto">
              <button
                onClick={logout}
                type="button"
                className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="my-1 flex items-center lg:my-0 lg:ml-auto">
              <Link
                to="/login"
                type="button"
                className="mr-2 inline-block rounded px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:text-primary-400 dark:hover:bg-neutral-700 dark:hover:bg-opacity-60 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                Login
              </Link>
              <Link
                to="/register"
                type="button"
                className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                Sign up for free
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="w-full bg-neutral-50 py-24 px-6 text-center dark:bg-neutral-900">
        <h1 className="mt-2 mb-16 text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">
          Clubhouse posts <br />
          <span className="text-primary">only members can see who's who</span>
        </h1>
        <div className="w-full flex flex-col justify-center items-center">
          {posts?.map((post) => (
            <CommentCard key={post._id} post={post} currentUser={user} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
