import axios from "axios";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderNav from "../components/HeaderNav";
import LoadingSpinner from "../components/LoadingSpinner";
import { UserType } from "./Dashboard";

const Membership = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [secretInput, setSecretInput] = useState("");
  const navigate = useNavigate();
  const SECRET = "odin";

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/getUser"
        );
        setUser(response.data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const updateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (secretInput.toLowerCase() === SECRET) {
      try {
        const response = await axios.patch(
          "http://localhost:3000/api/users/updateUser",
          { isMember: true }
        );
        setUser(response.data);
        navigate("/dashboard");
        toast.success("Membership successfull! Welcome!");
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("That's not the secret");
    }
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <section className="mb-40">
      <HeaderNav user={user} />
      <div className="bg-neutral-50 py-24 px-6 text-center dark:bg-neutral-900">
        <h1 className="mt-2 mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
          Enter your secret code <br />
          <span className="text-primary">to become a member 🎉</span>
        </h1>
        {!user && (
          <>
            <h2 className="mb-4 text-xl">Must be logged in</h2>
            <Link
              className="mb-2 inline-block rounded bg-primary px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] md:mr-2 md:mb-0"
              data-te-ripple-init
              data-te-ripple-color="light"
              to="/login"
              role="button"
            >
              Login
            </Link>
          </>
        )}
        {user?.isMember === false && (
          <>
            <h2 className="mb-4 text-xl">Enter code below</h2>
            <form
              onSubmit={updateUser}
              className="flex flex-col items-center justify-center mb-4 text-xl"
            >
              <input
                name="secretInput"
                id="secretInput"
                value={secretInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSecretInput(e.currentTarget.value)
                }
                className="bg-gray-100 mb-4 border-primary border-2 rounded mx-2 p-1 overflow-clip"
              ></input>
              <button
                className="mb-2 inline-block rounded bg-primary px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] md:mr-2 md:mb-0"
                type="submit"
              >
                Submit
              </button>
            </form>
          </>
        )}
        {user?.isMember === true && (
          <>
            <h2 className="mb-4 text-xl">You're already a member</h2>
            <Link
              className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              data-te-ripple-init
              data-te-ripple-color="light"
              to="/dashboard"
              role="button"
            >
              Come on in!
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default Membership;
