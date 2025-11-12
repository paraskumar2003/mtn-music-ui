import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, redirect, useActionData, Form } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as yup from "yup";
import { useState, useEffect, useRef } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const styles = "/assets/tailwind-Ci04w_VR.css";
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}, {
  rel: "stylesheet",
  href: styles
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function loader() {
  return redirect("/login");
}
function meta$2({}) {
  return [{
    title: "Redirecting..."
  }, {
    name: "description",
    content: "Redirecting to login page"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return null;
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  loader,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function meta$1({}) {
  return [{
    title: "Login | MyApp"
  }, {
    name: "description",
    content: "Login using email and OTP"
  }];
}
const login = UNSAFE_withComponentProps(function Login() {
  const actionData = useActionData();
  const [email, setEmail] = useState("");
  const isOtpStep = actionData?.step === "otp";
  useEffect(() => {
    if (isOtpStep && actionData?.email) {
      setEmail(actionData.email);
    }
  }, [isOtpStep, actionData]);
  return /* @__PURE__ */ jsx("main", {
    className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100",
    children: /* @__PURE__ */ jsxs("div", {
      className: "bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-semibold text-center mb-8 text-gray-800",
        children: "Sign In with OTP 🔐"
      }), /* @__PURE__ */ jsxs(Form, {
        method: "post",
        className: "space-y-6",
        children: [!isOtpStep ? /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              className: "block mb-2 text-sm font-medium text-gray-700",
              htmlFor: "email",
              children: "Email Address"
            }), /* @__PURE__ */ jsx("input", {
              id: "email",
              name: "email",
              type: "email",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black",
              placeholder: "you@example.com"
            })]
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            name: "_action",
            value: "sendOtp",
            className: "w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent",
            children: "Send OTP"
          })]
        }) : /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsxs("p", {
            className: "text-center text-gray-700 text-sm mb-4",
            children: ["An OTP has been sent to ", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("span", {
              className: "font-semibold text-gray-900",
              children: actionData?.email || email
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              className: "block mb-2 text-sm font-medium text-gray-700",
              htmlFor: "otp",
              children: "Enter OTP"
            }), /* @__PURE__ */ jsx("input", {
              id: "otp",
              name: "otp",
              type: "text",
              required: true,
              className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black",
              placeholder: "Enter 6-digit OTP"
            })]
          }), /* @__PURE__ */ jsx("button", {
            type: "submit",
            name: "_action",
            value: "verifyOtp",
            className: "w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent",
            children: "Verify & Continue"
          })]
        }), actionData?.error && /* @__PURE__ */ jsx("p", {
          className: "text-red-600 text-center mt-4",
          children: actionData.error
        })]
      }), /* @__PURE__ */ jsxs("p", {
        className: "mt-8 text-center text-sm text-gray-600",
        children: ["Don’t have an account?", " ", /* @__PURE__ */ jsx("a", {
          href: "/register",
          className: "text-blue-600 hover:text-blue-800 font-medium",
          children: "Sign up"
        })]
      })]
    })
  });
});
async function action$1({
  request
}) {
  const formData = await request.formData();
  const actionType = formData.get("_action");
  const email = formData.get("email")?.toString();
  const emailSchema = yup.object({
    email: yup.string().email("Please enter a valid email address").required("Email is required")
  });
  const otpSchema = yup.object({
    otp: yup.string().matches(/^\d{6}$/, "OTP must be a 6-digit number").required("OTP is required")
  });
  if (actionType === "sendOtp") {
    try {
      await emailSchema.validate({
        email
      }, {
        abortEarly: false
      });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return {
          error: err.errors[0],
          step: "email"
        };
      }
      return {
        error: "Unexpected error",
        step: "email"
      };
    }
    console.log("OTP sent to:", email);
    return {
      step: "otp",
      email
    };
  }
  if (actionType === "verifyOtp") {
    const otp = formData.get("otp")?.toString();
    try {
      await otpSchema.validate({
        otp
      }, {
        abortEarly: false
      });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return {
          error: err.errors[0],
          step: "otp",
          email
        };
      }
      return {
        error: "Unexpected error",
        step: "otp",
        email
      };
    }
    if (otp === "111111") {
      throw redirect("/quiz");
    }
    return {
      error: "Invalid OTP",
      step: "otp",
      email
    };
  }
  return null;
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: login,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function meta({}) {
  return [{
    title: "Register | MyApp"
  }, {
    name: "description",
    content: "Create a new account"
  }];
}
const register = UNSAFE_withComponentProps(function Register() {
  const actionData = useActionData();
  return /* @__PURE__ */ jsx("main", {
    className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100",
    children: /* @__PURE__ */ jsxs("div", {
      className: "bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-semibold text-center mb-8 text-gray-800",
        children: "Create Account ✨"
      }), /* @__PURE__ */ jsxs(Form, {
        method: "post",
        className: "space-y-6",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            className: "block mb-2 text-sm font-medium text-gray-700",
            htmlFor: "name",
            children: "Full Name"
          }), /* @__PURE__ */ jsx("input", {
            id: "name",
            name: "name",
            type: "text",
            required: true,
            className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black",
            placeholder: "John Doe"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            className: "block mb-2 text-sm font-medium text-gray-700",
            htmlFor: "mobile",
            children: "Mobile Number"
          }), /* @__PURE__ */ jsx("input", {
            id: "mobile",
            name: "mobile",
            type: "tel",
            required: true,
            className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black",
            placeholder: "+91 98765 43210"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("label", {
            className: "block mb-2 text-sm font-medium text-gray-700",
            htmlFor: "email",
            children: "Email Address"
          }), /* @__PURE__ */ jsx("input", {
            id: "email",
            name: "email",
            type: "email",
            required: true,
            className: "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black",
            placeholder: "you@example.com"
          })]
        }), /* @__PURE__ */ jsx("button", {
          type: "submit",
          className: "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200",
          children: "Register"
        }), actionData?.error && /* @__PURE__ */ jsx("p", {
          className: "text-red-600 text-center mt-4",
          children: actionData.error
        })]
      }), /* @__PURE__ */ jsxs("p", {
        className: "mt-8 text-center text-sm text-gray-600",
        children: ["Already have an account?", " ", /* @__PURE__ */ jsx("a", {
          href: "/login",
          className: "text-blue-600 hover:text-blue-800 font-medium",
          children: "Sign In"
        })]
      })]
    })
  });
});
async function action({
  request
}) {
  const formData = await request.formData();
  const name = formData.get("name");
  const mobile = formData.get("mobile");
  const email = formData.get("email");
  if (!name || !mobile || !email) {
    return {
      error: "All fields are required"
    };
  }
  console.log("New user registered:", {
    name,
    mobile,
    email
  });
  throw redirect("/quiz");
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: register,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0";
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white focus:ring-primary-500 border border-transparent",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500 border border-transparent",
    success: "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white focus:ring-accent-500 border border-transparent"
  };
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  return /* @__PURE__ */ jsx("button", { className: classes, disabled: disabled || loading, ...props, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
    loading && /* @__PURE__ */ jsxs(
      "svg",
      {
        className: "mr-2 h-4 w-4 animate-spin",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        children: [
          /* @__PURE__ */ jsx(
            "circle",
            {
              className: "opacity-25",
              cx: "12",
              cy: "12",
              r: "10",
              stroke: "currentColor",
              strokeWidth: "4"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              className: "opacity-75",
              fill: "currentColor",
              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            }
          )
        ]
      }
    ),
    children
  ] }) });
};
const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext
}) => {
  const [answered, setAnswered] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    console.log(selectedOption);
  }, [selectedOption]);
  const [mediaRecorder, setMediaRecorder] = useState(
    null
  );
  const [recording, setRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const handleOptionClick = (option) => {
    console.log("clicked");
    setSelectedOption(option);
    onAnswer(option);
  };
  const handleTextSubmit = () => {
    if (!textAnswer.trim()) return;
    onAnswer(textAnswer.trim());
    onNext();
    setTextAnswer("");
  };
  const handleStartRecording = async () => {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: question.question_type === "video"
      });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: question.question_type === "audio" ? "audio/webm" : "video/webm"
        });
        setMediaBlob(blob);
        onAnswer(blob);
        if (question.question_type === "audio" && audioRef.current) {
          audioRef.current.src = URL.createObjectURL(blob);
        }
        if (question.question_type === "video" && videoRef.current) {
          videoRef.current.src = URL.createObjectURL(blob);
        }
      };
      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };
  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto bg-[#04061C] rounded-2xl shadow-xl border border-gray-100 p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-6 text-sm text-white-500", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Question ",
        questionNumber
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "capitalize", children: [
        question.dimension,
        " • ",
        question.level
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "h2",
      {
        className: "text-xl font-semibold text-white-900 mb-6",
        dangerouslySetInnerHTML: { __html: question.prompt_html }
      }
    ),
    question.image_url && /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: question.image_url,
        alt: "Question",
        className: "rounded-lg border border-gray-200 max-h-64 object-contain"
      }
    ) }),
    question.audio_url && /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("audio", { controls: true, className: "w-full", children: [
      /* @__PURE__ */ jsx("source", { src: question.audio_url, type: "audio/mpeg" }),
      "Your browser does not support the audio tag."
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      question.question_type === "mcq" && /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: question.options && question.options.map((opt) => {
        const isSelected = selectedOption === opt;
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              handleOptionClick(opt);
              console.log("clicked");
            },
            disabled: answered,
            className: `px-4 py-3 rounded-xl border text-left transition-all duration-200
                    ${isSelected ? "bg-primary-600 text-white border-primary-700" : "bg-white text-gray-800 border-gray-300 hover:bg-primary-50"}
                    disabled:opacity-80`,
            children: opt
          },
          opt
        );
      }) }),
      question.question_type === "text" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            rows: 4,
            placeholder: "Type your answer here...",
            className: "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 text-white",
            value: textAnswer,
            onChange: (e) => setTextAnswer(e.target.value),
            disabled: answered
          }
        ),
        !answered && /* @__PURE__ */ jsx(Button, { variant: "primary", size: "lg", onClick: handleTextSubmit, children: "Submit Answer →" })
      ] }),
      ["audio", "video", "image"].includes(question.question_type) && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
        (question.question_type === "audio" || question.question_type === "video") && /* @__PURE__ */ jsxs(Fragment, { children: [
          !recording && !answered && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "primary",
              size: "lg",
              onClick: handleStartRecording,
              children: question.question_type === "audio" ? "🎙️ Start Recording" : "🎥 Start Recording"
            }
          ),
          recording && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "danger",
              size: "lg",
              onClick: handleStopRecording,
              children: "⏹️ Stop Recording"
            }
          ),
          mediaBlob && question.question_type === "audio" && /* @__PURE__ */ jsx("audio", { ref: audioRef, controls: true, className: "mt-4" }),
          mediaBlob && question.question_type === "video" && /* @__PURE__ */ jsx(
            "video",
            {
              ref: videoRef,
              controls: true,
              className: "mt-4 w-full rounded-lg"
            }
          )
        ] }),
        question.question_type === "image" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          !answered && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "cameraInput",
                type: "file",
                accept: "image/*",
                capture: "environment",
                className: "hidden",
                onChange: (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onAnswer(file);
                    setMediaBlob(file);
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "primary",
                size: "lg",
                onClick: () => {
                  const input = document.getElementById(
                    "cameraInput"
                  );
                  input?.click();
                },
                children: "📸 Capture / Upload Image"
              }
            )
          ] }),
          mediaBlob && /* @__PURE__ */ jsx(
            "img",
            {
              src: URL.createObjectURL(mediaBlob),
              alt: "Captured",
              className: "mt-4 rounded-lg border border-gray-200 max-h-64 object-contain"
            }
          )
        ] })
      ] })
    ] }),
    !answered && question.question_type !== "text" && /* @__PURE__ */ jsx("div", { className: "text-center mt-6", children: /* @__PURE__ */ jsx(Button, { variant: "primary", size: "lg", onClick: onNext, children: "Next Question →" }) })
  ] });
};
const quizData = [{
  question_id: "q21",
  dimension: "visual",
  level: "basic",
  type: "written",
  prompt_html: "Look at this 4-bar melody in C major. Count how many notes move by <b>step</b> (not skip).",
  image_url: "./assets/q21.png",
  audio_url: null,
  options: null,
  question_type: "text"
}, {
  question_id: "q22",
  dimension: "visual",
  level: "basic",
  type: "mcq",
  prompt_html: "Identify the <b>time signature</b> of this rhythm snippet.",
  image_url: "./assets/q22.png",
  audio_url: null,
  options: ["2/4", "3/4", "4/4", "6/8"],
  question_type: "mcq"
}, {
  question_id: "q23",
  dimension: "visual",
  level: "intermediate",
  type: "mcq",
  prompt_html: "Observe this chord staff — which <b>inversion</b> is written here?",
  image_url: "./assets/q23.png",
  audio_url: null,
  options: ["Root", "1st inversion", "2nd inversion", "3rd inversion"],
  question_type: "mcq"
}, {
  question_id: "q24",
  dimension: "visual",
  level: "intermediate",
  type: "written",
  prompt_html: "If this is in <b>G major</b>, which accquestion_idental note is missing in bar 3?",
  image_url: "./assets/q24.png",
  audio_url: null,
  options: null,
  question_type: "text"
}, {
  question_id: "q25",
  dimension: "visual",
  level: "intermediate",
  type: "image",
  prompt_html: "Copy this short 2-bar motif on paper and upload its <b>mirror image</b>.",
  image_url: "./assets/q25.png",
  audio_url: null,
  options: null,
  question_type: "image"
}, {
  question_id: "q26",
  dimension: "visual",
  level: "basic",
  type: "mcq",
  prompt_html: "The excerpt ends on a half-note tied to a quarter — what is the <b>total duration</b>?",
  image_url: "./assets/q26.png",
  audio_url: null,
  options: ["2 beats", "3 beats", "4 beats", "6 beats"],
  question_type: "mcq"
}, {
  question_id: "q27",
  dimension: "auditory",
  level: "basic",
  type: "audio",
  prompt_html: "Listen to this short clip. Tap along — is the pulse <b>duple</b> or <b>triple</b>?",
  image_url: null,
  audio_url: "./assets/q27.mp3",
  options: ["Duple", "Triple"],
  question_type: "mcq"
}, {
  question_id: "q28",
  dimension: "auditory",
  level: "basic",
  type: "audio",
  prompt_html: "After hearing two scales, choose which one feels <b>major</b>.",
  image_url: null,
  audio_url: "./assets/q28.mp3",
  options: ["First", "Second"],
  question_type: "mcq"
}, {
  question_id: "q29",
  dimension: "auditory",
  level: "intermediate",
  type: "audio",
  prompt_html: "Hum the rhythm you just heard and record your voice.",
  image_url: null,
  audio_url: "./assets/q21.mp3",
  options: null,
  question_type: "audio"
}, {
  question_id: "q30",
  dimension: "auditory",
  level: "intermediate",
  type: "audio",
  prompt_html: "Identify if the melody ascends, descends, or oscillates around a central tone.",
  image_url: null,
  audio_url: "./assets/q28.mp3",
  options: ["Ascends", "Descends", "Oscillates"],
  question_type: "mcq"
}, {
  question_id: "q31",
  dimension: "auditory",
  level: "intermediate",
  type: "audio",
  prompt_html: "Two chords are played. Are they the <b>same</b> or <b>different</b> in quality (major/minor)?",
  image_url: null,
  audio_url: "./assets/q23.mp3",
  options: ["Same", "Different"],
  question_type: "mcq"
}, {
  question_id: "q32",
  dimension: "subconscious",
  level: "basic",
  type: "psychometric",
  prompt_html: "When faced with a new tune, what do you instinctively notice first?",
  image_url: null,
  audio_url: null,
  options: ["Shape", "Sound", "Feel"],
  question_type: "mcq"
}, {
  question_id: "q33",
  dimension: "subconscious",
  level: "basic",
  type: "psychometric",
  prompt_html: "If a teammate plays wrong notes mquestion_id-performance, what’s your immediate reaction?",
  image_url: null,
  audio_url: null,
  options: ["Ignore and continue", "Stop and correct", "Adjust quickly and adapt"],
  question_type: "mcq"
}, {
  question_id: "q34",
  dimension: "subconscious",
  level: "intermediate",
  type: "psychometric",
  prompt_html: "You’re asked to compose in 10 minutes — what’s your starting point?",
  image_url: null,
  audio_url: null,
  options: ["Melody", "Rhythm", "Harmony", "Mood"],
  question_type: "mcq"
}, {
  question_id: "q35",
  dimension: "subconscious",
  level: "basic",
  type: "psychometric",
  prompt_html: "Choose the sentence that fits you most.",
  image_url: null,
  audio_url: null,
  options: ["I see music", "I feel music", "I hear music"],
  question_type: "mcq"
}, {
  question_id: "q36",
  dimension: "subconscious",
  level: "intermediate",
  type: "psychometric",
  prompt_html: "Which activity relaxes you more?",
  image_url: null,
  audio_url: null,
  options: ["Writing", "Listening", "Organizing playlists"],
  question_type: "mcq"
}, {
  question_id: "q37",
  dimension: "rhythmic",
  level: "basic",
  type: "audio",
  prompt_html: "Tap along with the metronome (♩ = 100). Then double the tempo. Were you able to stay steady?",
  image_url: null,
  audio_url: "./assets/q27.mp3",
  options: ["Yes", "No", "Partly"],
  question_type: "mcq"
}, {
  question_id: "q38",
  dimension: "rhythmic",
  level: "basic",
  type: "mcq",
  prompt_html: "Look at this 1-bar rhythm: eighth-eighth-quarter-quarter. Which beat feels strongest?",
  image_url: "./assets/q26.png",
  audio_url: null,
  options: ["Beat 1", "Beat 2", "Beat 3", "Beat 4"],
  question_type: "mcq"
}, {
  question_id: "q39",
  dimension: "rhythmic",
  level: "intermediate",
  type: "image",
  prompt_html: "You have 60 seconds to copy a 2-bar rhythm pattern — start when ready and upload your written image.",
  image_url: "./assets/q25.png",
  audio_url: null,
  options: null,
  question_type: "image"
}, {
  question_id: "q40",
  dimension: "rhythmic",
  level: "psychometric",
  type: "psychometric",
  prompt_html: "Rate yourself: how regularly do you practice or study (1 = chaotic, 5 = highly consistent)?",
  image_url: null,
  audio_url: null,
  options: ["1", "2", "3", "4", "5"],
  question_type: "mcq"
}, {
  question_id: "q41",
  dimension: "rhythmic",
  level: "psychometric",
  type: "psychometric",
  prompt_html: "When working late nights, does your focus improve or decline sharply?",
  image_url: null,
  audio_url: null,
  options: ["Improves", "Declines", "No change"],
  question_type: "mcq"
}];
const quiz = UNSAFE_withComponentProps(function QuizPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const handleAnswer = (option) => {
    const q = quizData[index];
    setAnswers((prev) => ({
      ...prev,
      [q.question_id]: option
    }));
  };
  useEffect(() => {
    console.log({
      index
    });
  }, [index]);
  const handleNext = () => {
    if (index < quizData.length - 1) {
      setIndex(index + 1);
    } else {
      setShowPopup(true);
    }
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-gray-50 flex items-center justify-center p-6 bg-[url('/assets/background-image.jpg')]",
    children: [/* @__PURE__ */ jsx(QuizQuestion, {
      question: quizData[index],
      questionNumber: index + 1,
      totalQuestions: quizData.length,
      onAnswer: handleAnswer,
      onNext: handleNext
    }), showPopup && /* @__PURE__ */ jsx("div", {
      className: "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
      children: /* @__PURE__ */ jsxs("div", {
        className: "bg-white rounded-2xl shadow-xl p-8 max-w-sm text-center",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-xl font-semibold mb-4",
          children: "Quiz Completed 🎉"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-gray-600 mb-6",
          children: "Results will be shared on mail with you shortly."
        }), /* @__PURE__ */ jsx("button", {
          onClick: handleClosePopup,
          className: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg",
          children: "Close"
        })]
      })
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: quiz
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CS0t8mQ7.js", "imports": ["/assets/jsx-runtime-u17CrQMm.js", "/assets/chunk-UIGDSWPH-ChJgZbLH.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DnNgl7jx.js", "imports": ["/assets/jsx-runtime-u17CrQMm.js", "/assets/chunk-UIGDSWPH-ChJgZbLH.js"], "css": ["/assets/root-CZlocQJr.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CS813b1x.js", "imports": ["/assets/chunk-UIGDSWPH-ChJgZbLH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-DQqsejmV.js", "imports": ["/assets/chunk-UIGDSWPH-ChJgZbLH.js", "/assets/jsx-runtime-u17CrQMm.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/register": { "id": "routes/register", "parentId": "root", "path": "/register", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/register-BvTmyypm.js", "imports": ["/assets/chunk-UIGDSWPH-ChJgZbLH.js", "/assets/jsx-runtime-u17CrQMm.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/quiz": { "id": "routes/quiz", "parentId": "root", "path": "/quiz", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/quiz-C_zKjKkt.js", "imports": ["/assets/chunk-UIGDSWPH-ChJgZbLH.js", "/assets/jsx-runtime-u17CrQMm.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-cb19802e.js", "version": "cb19802e", "sri": void 0 };
const assetsBuildDirectory = "dist/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "/login",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/register": {
    id: "routes/register",
    parentId: "root",
    path: "/register",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/quiz": {
    id: "routes/quiz",
    parentId: "root",
    path: "/quiz",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
