import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import LoadingDotsIcon from "./LoadingDotsIcon"

function HeaderLoggedOut(props) {
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    submitCount: 0,
    isSigningIn: false
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameRules":
        if (!action.value.trim()) {
          draft.username.hasErrors = true
          draft.username.message = "Username cannot be blank."
        }
        return
      case "usernameChange":
        draft.username.hasErrors = false
        draft.username.value = action.value
        return
      case "passwordRules":
        if (!action.value.trim()) {
          draft.password.hasErrors = true
          draft.password.message = "Password cannot be blank."
        }
        return
      case "passwordChange":
        draft.password.hasErrors = false
        draft.password.value = action.value
        return
      case "signingIn":
        draft.isSigningIn = true
        return
      case "signIn":
        if (!draft.username.hasErrors && !draft.password.hasErrors) {
          draft.submitCount++
        }
        return
      case "signedIn":
        draft.isSigningIn = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  async function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "usernameRules", value: state.username.value })
    dispatch({ type: "passwordRules", value: state.password.value })
    dispatch({ type: "signIn" })
  }

  useEffect(() => {
    console.log(`submitCount= ${state.submitCount}`)
    if (state.submitCount) {
      dispatch({ type: "signingIn" })
      const ourRequest = Axios.CancelToken.source()

      async function signIn() {
        try {
          const response = await Axios.post("/login", { username: state.username.value, password: state.password.value })
          dispatch({ type: "signedIn" })
          if (response.data) {
            appDispatch({ type: "login", data: response.data })
            appDispatch({ type: "flashMessage", value: "You have successfully logged in." })
          } else {
            console.log("Incorrect username / password.")
            appDispatch({ type: "flashMessage", value: "Invalid username/ password." })
          }
        } catch (e) {
          console.log("There was a problem.")
        }
      }
      signIn()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.submitCount])

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0 ">
          <input onChange={e => dispatch({ type: "usernameChange", value: e.target.value })} name="username" className={"form-control form-control-sm input-dark " + (state.username.hasErrors ? "is-invalid" : "")} type="text" placeholder={state.username.hasErrors ? "Username cannot be empty." : "Username"} autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => dispatch({ type: "passwordChange", value: e.target.value })} name="password" className={"form-control form-control-sm input-dark " + (state.password.hasErrors ? "is-invalid" : "")} type="password" placeholder={state.password.hasErrors ? "Password cannot be empty." : "Password"} />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm" disabled={state.isSigningIn}>
            {state.isSigningIn ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
