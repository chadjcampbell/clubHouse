import axios from "axios";
import { FormEvent } from "react";
import { toast } from "react-toastify";
import { PostType, UserType } from "../pages/Dashboard";
import EditPost from "./EditPost";

type CommentCardProps = {
  currentUser: UserType | null;
  post: PostType;
};

const CommentCard = ({ currentUser, post }: CommentCardProps) => {
  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.delete("http://localhost:3000/api/messages/" + post._id);
      location.reload();
      toast.success("Post deleted successfully");
    } catch {
      toast.error("Post deletion failed");
    }
  };

  return (
    <div className="flex flex-col items-start mb-4 w-4/5 rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
      <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
        {currentUser?.isMember ? post.user.name : "Anon"}
      </h5>
      <p className="break-words mb-4 text-base text-neutral-600 dark:text-neutral-200">
        {post.message}
      </p>
      {currentUser?.isMember && (
        <code className="text-xs mb-3">
          Posted {new Date(post.createdAt).toLocaleString()}
        </code>
      )}
      <div>
        {currentUser?._id === post.user._id && <EditPost post={post} />}
        {currentUser?.isAdmin && (
          <button
            type="button"
            onClick={handleDelete}
            className="mx-5 inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
