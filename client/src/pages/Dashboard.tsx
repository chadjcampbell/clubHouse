import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentCard from "../components/CommentCard";
import AddPost from "../components/AddPost";
import HeaderNav from "../components/HeaderNav";

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

  return loading ? (
    <LoadingSpinner />
  ) : (
    <section className="mb-40">
      <HeaderNav user={user} />
      <div className="w-full bg-neutral-50 py-24 px-6 text-center dark:bg-neutral-900">
        <h1 className="mt-2 mb-16 text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">
          Clubhouse posts <br />
          <span className="text-primary">only members can see who's who</span>
        </h1>
        {user && (
          <div className="bg-neutral-50 py-6 px-6 text-center dark:bg-neutral-900">
            <AddPost />
            {!user.isMember && (
              <Link
                className="inline-block rounded px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:hover:bg-neutral-800 dark:hover:bg-opacity-60"
                data-te-ripple-init
                data-te-ripple-color="light"
                to="/membership"
                role="button"
              >
                Join the club
              </Link>
            )}
          </div>
        )}
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
