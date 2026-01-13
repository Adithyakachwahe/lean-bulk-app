import { useContext } from "react";
import userContext from "../../contexts/userContext";
import "./Register.css";

export default function Register() {
  const { user, setUser, handleSubmit } = useContext(userContext);
  return (
    <>
      <div className="container">
        <h2 className="heading">Register</h2>
        <div className="container">
          <form onSubmit={(e)=>handleSubmit(e,"register")}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
